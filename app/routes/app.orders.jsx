"use client"

import { useLoaderData } from "@remix-run/react"
import {
  Page,
  Layout,
  Card,
  DataTable,
  Badge,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockOrders } from "../../lib/mock-data"
import { useState } from "react"

export const loader = async ({ request }) => {
  await authenticate.admin(request)

  // In a real app, you would fetch from Shopify API
  return { orders: mockOrders }
}

export default function Orders() {
  const { orders } = useLoaderData()
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.fulfillmentStatus.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const rows = filteredOrders.map((order) => [
    <Text variant="bodyMd" fontWeight="medium" key={order.id}>
      {order.name}
    </Text>,
    formatDate(order.createdAt),
    <InlineStack gap="100" key={order.customer.email}>
      <Text variant="bodyMd">
        {order.customer.firstName} {order.customer.lastName}
      </Text>
      <Text variant="bodySm" tone="subdued">
        {order.customer.email}
      </Text>
    </InlineStack>,
    <Badge tone={order.financialStatus === "PAID" ? "success" : "warning"} key={order.financialStatus}>
      {order.financialStatus}
    </Badge>,
    <Badge tone={order.fulfillmentStatus === "FULFILLED" ? "success" : "attention"} key={order.fulfillmentStatus}>
      {order.fulfillmentStatus}
    </Badge>,
    `$${order.totalPrice}`,
  ])

  return (
    <Page>
      <TitleBar title="Orders" />

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <div style={{ flexGrow: 1 }}>
                  <TextField
                    label="Search orders"
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search by order number or customer email..."
                    clearButton
                    onClearButtonClick={() => setSearchValue("")}
                  />
                </div>
                <Select
                  label="Fulfillment Status"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Fulfilled", value: "fulfilled" },
                    { label: "Unfulfilled", value: "unfulfilled" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </InlineStack>

              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["Order", "Date", "Customer", "Payment", "Fulfillment", "Total"]}
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
    </Page>
  )
}
