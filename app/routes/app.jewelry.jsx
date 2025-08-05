"use client"

import { useState } from "react"
import { useLoaderData } from "@remix-run/react"
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
  Thumbnail,
  Tabs,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockJewelryProducts, mockDiamonds } from "../../lib/diamond-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)
  return {
    jewelry: mockJewelryProducts,
    diamonds: mockDiamonds,
  }
}

export default function Jewelry() {
  const { jewelry, diamonds } = useLoaderData()
  const [activeTab, setActiveTab] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedJewelry, setSelectedJewelry] = useState(null)

  const filteredJewelry = jewelry.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const tabs = [
    {
      id: "jewelry-list",
      content: "Jewelry Settings",
      panelID: "jewelry-list-panel",
    },
    {
      id: "ai-curation",
      content: "AI Curation",
      panelID: "ai-curation-panel",
    },
  ]

  const jewelryRows = filteredJewelry.map((item) => [
    <InlineStack gap="300" key={item.id}>
      <Thumbnail source={item.images[0]} alt={item.title} size="small" />
      <BlockStack gap="025">
        <Text variant="bodyMd" fontWeight="medium" key={`title-${item.id}`}>
          {item.title}
        </Text>
        <Text variant="bodySm" tone="subdued" key={`details-${item.id}`}>
          {item.metal} • {item.setting}
        </Text>
      </BlockStack>
    </InlineStack>,
    <Badge tone="info" key={`category-${item.id}`}>
      {item.category}
    </Badge>,
    `$${item.basePrice.toLocaleString()}`,
    item.compatibleShapes.join(", "),
    <InlineStack gap="200" key={`actions-${item.id}`}>
      <Button
        size="slim"
        onClick={() => {
          setSelectedJewelry(item)
          setShowModal(true)
        }}
      >
        View Details
      </Button>
      <Button size="slim" variant="primary" onClick={() => console.log("Curate diamonds", item.id)}>
        Find Diamonds
      </Button>
    </InlineStack>,
  ])

  const getRecommendedDiamonds = (jewelryItem) => {
    return diamonds.filter((diamond) => jewelryItem.compatibleShapes.includes(diamond.shape)).slice(0, 3)
  }

  return (
    <Page>
      <TitleBar title="Jewelry Settings">
        <Button variant="primary" onClick={() => console.log("Add jewelry")}>
          Add Jewelry Setting
        </Button>
      </TitleBar>

      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
              {activeTab === 0 && (
                <BlockStack gap="400">
                  <InlineStack gap="400">
                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        label="Search jewelry"
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="Search by jewelry name..."
                        clearButton
                        onClearButtonClick={() => setSearchValue("")}
                      />
                    </div>
                    <Select
                      label="Category"
                      options={[
                        { label: "All Categories", value: "all" },
                        { label: "Engagement Rings", value: "Engagement Rings" },
                        { label: "Anniversary Rings", value: "Anniversary Rings" },
                        { label: "Wedding Bands", value: "Wedding Bands" },
                      ]}
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                    />
                  </InlineStack>

                  <DataTable
                    columnContentTypes={["text", "text", "text", "text", "text"]}
                    headings={["Jewelry", "Category", "Base Price", "Compatible Shapes", "Actions"]}
                    rows={jewelryRows}
                    pagination={{
                      hasNext: false,
                      hasPrevious: false,
                    }}
                  />
                </BlockStack>
              )}

              {activeTab === 1 && (
                <BlockStack gap="400">
                  <Text variant="headingMd">AI-Powered Diamond Curation</Text>
                  <Text variant="bodyMd" tone="subdued">
                    Our AI analyzes your jewelry settings and recommends the perfect diamonds based on style,
                    proportions, and customer preferences.
                  </Text>

                  <Layout>
                    {filteredJewelry.slice(0, 2).map((item) => {
                      const recommendedDiamonds = getRecommendedDiamonds(item)
                      return (
                        <Layout.Section variant="oneHalf" key={item.id}>
                          <Card>
                            <BlockStack gap="400">
                              <InlineStack gap="300">
                                <Thumbnail source={item.images[0]} alt={item.title} size="medium" />
                                <BlockStack gap="200">
                                  <Text variant="headingMd" key={`jewelry-title-${item.id}`}>
                                    {item.title}
                                  </Text>
                                  <Text variant="bodyMd" tone="subdued" key={`jewelry-metal-${item.id}`}>
                                    {item.metal}
                                  </Text>
                                  <Text variant="bodyMd" key={`jewelry-base-price-${item.id}`}>
                                    Base: ${item.basePrice.toLocaleString()}
                                  </Text>
                                </BlockStack>
                              </InlineStack>

                              <BlockStack gap="300">
                                <Text variant="headingMd">Recommended Diamonds</Text>
                                {recommendedDiamonds.map((diamond) => (
                                  <Card key={diamond.id}>
                                    <InlineStack gap="300" align="space-between">
                                      <InlineStack gap="200">
                                        <Thumbnail
                                          source={diamond.imageUrl}
                                          alt={`${diamond.shape} Diamond`}
                                          size="small"
                                        />
                                        <BlockStack gap="025">
                                          <Text
                                            variant="bodyMd"
                                            fontWeight="medium"
                                            key={`diamond-carat-${diamond.id}`}
                                          >
                                            {diamond.carat}ct {diamond.shape}
                                          </Text>
                                          <Text variant="bodySm" tone="subdued" key={`diamond-details-${diamond.id}`}>
                                            {diamond.color}/{diamond.clarity} • {diamond.cut}
                                          </Text>
                                        </BlockStack>
                                      </InlineStack>
                                      <BlockStack gap="025" align="end">
                                        <Text variant="bodyMd" fontWeight="medium" key={`diamond-price-${diamond.id}`}>
                                          ${diamond.price.toLocaleString()}
                                        </Text>
                                        <Text variant="bodySm" tone="success" key={`total-price-${diamond.id}`}>
                                          Total: ${(item.basePrice + diamond.price).toLocaleString()}
                                        </Text>
                                      </BlockStack>
                                    </InlineStack>
                                  </Card>
                                ))}
                                <Button variant="primary" fullWidth>
                                  Create Complete Product
                                </Button>
                              </BlockStack>
                            </BlockStack>
                          </Card>
                        </Layout.Section>
                      )
                    })}
                  </Layout>
                </BlockStack>
              )}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Jewelry Details Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selectedJewelry?.title || "Jewelry Details"}
        large
      >
        {selectedJewelry && (
          <Modal.Section>
            <Layout>
              <Layout.Section variant="oneHalf">
                <Thumbnail source={selectedJewelry.images[0]} alt={selectedJewelry.title} size="large" />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <BlockStack gap="300">
                  <Text variant="headingLg" key={`modal-title-${selectedJewelry.id}`}>
                    {selectedJewelry.title}
                  </Text>
                  <Text variant="bodyMd" key={`modal-description-${selectedJewelry.id}`}>
                    {selectedJewelry.description}
                  </Text>

                  <BlockStack gap="200">
                    <Text variant="bodyMd" key={`modal-metal-${selectedJewelry.id}`}>
                      <strong>Metal:</strong> {selectedJewelry.metal}
                    </Text>
                    <Text variant="bodyMd" key={`modal-setting-${selectedJewelry.id}`}>
                      <strong>Setting Style:</strong> {selectedJewelry.setting}
                    </Text>
                    <Text variant="bodyMd" key={`modal-ring-size-${selectedJewelry.id}`}>
                      <strong>Ring Size:</strong> {selectedJewelry.ringSize}
                    </Text>
                    <Text variant="bodyMd" key={`modal-compatible-shapes-${selectedJewelry.id}`}>
                      <strong>Compatible Shapes:</strong> {selectedJewelry.compatibleShapes.join(", ")}
                    </Text>
                  </BlockStack>

                  <Text variant="headingMd" tone="success" key={`modal-base-price-${selectedJewelry.id}`}>
                    Base Price: ${selectedJewelry.basePrice.toLocaleString()}
                  </Text>

                  <InlineStack gap="200">
                    <Button variant="primary">Find Matching Diamonds</Button>
                    <Button>Edit Setting</Button>
                  </InlineStack>
                </BlockStack>
              </Layout.Section>
            </Layout>
          </Modal.Section>
        )}
      </Modal>
    </Page>
  )
}
