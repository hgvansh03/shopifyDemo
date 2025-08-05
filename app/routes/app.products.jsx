"use client"

import { useState } from "react"
import { useLoaderData, useFetcher } from "@remix-run/react"
import {
  Page,
  Layout,
  Card,
  DataTable,
  Button,
  Badge,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Modal,
  FormLayout,
  Thumbnail,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockProducts } from "../../lib/mock-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)

  // In a real app, you would fetch from Shopify API
  // For demo purposes, we're using mock data
  return { products: mockProducts }
}

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request)
  const formData = await request.formData()
  const action = formData.get("action")

  if (action === "create") {
    const title = formData.get("title")
    const price = formData.get("price")
    const description = formData.get("description")

    // In a real app, you would create the product via Shopify API
    const response = await admin.graphql(
      `#graphql
        mutation productCreate($product: ProductCreateInput!) {
          productCreate(product: $product) {
            product {
              id
              title
              handle
              status
            }
            userErrors {
              field
              message
            }
          }
        }`,
      {
        variables: {
          product: {
            title,
            descriptionHtml: description,
            variants: [{ price }],
          },
        },
      },
    )

    const responseJson = await response.json()
    return { product: responseJson.data.productCreate.product }
  }

  return null
}

export default function Products() {
  const { products } = useLoaderData()
  const fetcher = useFetcher()
  const [showModal, setShowModal] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const rows = filteredProducts.map((product) => [
    <InlineStack gap="200" key={product.id}>
      <Thumbnail
        source={product.images[0]?.url || "/placeholder.svg?height=40&width=40"}
        alt={product.title}
        size="small"
      />
      <Text variant="bodyMd" fontWeight="medium">
        {product.title}
      </Text>
    </InlineStack>,
    <Badge key={`status-${product.id}`} tone={product.status === "ACTIVE" ? "success" : "critical"}>
      {product.status}
    </Badge>,
    product.variants.length > 0 ? `$${product.variants[0].price}` : "N/A",
    product.variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0),
    product.vendor,
    <Button key={`edit-${product.id}`} size="slim" onClick={() => console.log("Edit", product.id)}>
      Edit
    </Button>,
  ])

  const handleCreateProduct = () => {
    const formData = new FormData()
    formData.append("action", "create")
    formData.append("title", newProduct.title)
    formData.append("price", newProduct.price)
    formData.append("description", newProduct.description)

    fetcher.submit(formData, { method: "post" })
    setShowModal(false)
    setNewProduct({ title: "", price: "", description: "" })
  }

  return (
    <Page>
      <TitleBar title="Products">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Product
        </Button>
      </TitleBar>

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    label="Search products"
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search by product name..."
                    clearButton
                    onClearButtonClick={() => setSearchValue("")}
                  />
                </div>
                <Select
                  label="Status"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Draft", value: "draft" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </InlineStack>

              <DataTable
                columnContentTypes={["text", "text", "text", "numeric", "text", "text"]}
                headings={["Product", "Status", "Price", "Inventory", "Vendor", "Actions"]}
                rows={rows}
                pagination={{
                  hasNext: false,
                  hasPrevious: false,
                }}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Product"
        primaryAction={{
          content: "Create Product",
          onAction: handleCreateProduct,
          loading: fetcher.state === "submitting",
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowModal(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Product Title"
              value={newProduct.title}
              onChange={(value) => setNewProduct({ ...newProduct, title: value })}
              placeholder="Enter product title"
            />
            <TextField
              label="Price"
              value={newProduct.price}
              onChange={(value) => setNewProduct({ ...newProduct, price: value })}
              placeholder="0.00"
              prefix="$"
              type="number"
            />
            <TextField
              label="Description"
              value={newProduct.description}
              onChange={(value) => setNewProduct({ ...newProduct, description: value })}
              placeholder="Enter product description"
              multiline={4}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
