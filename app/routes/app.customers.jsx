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
  Avatar,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockCustomers } from "../../lib/mock-data"
import { useState } from "react"

export const loader = async ({ request }) => {
  await authenticate.admin(request)

  // In a real app, you would fetch from Shopify API
  return { customers: mockCustomers }
}

export default function Customers() {
  const { customers } = useLoaderData()
  const [searchValue, setSearchValue] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = searchValue.toLowerCase()
    return (
      customer.firstName.toLowerCase().includes(searchTerm) ||
      customer.lastName.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    )
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const rows = filteredCustomers.map((customer) => [
    <InlineStack gap="300" key={customer.id}>
      <Avatar customer name={`${customer.firstName} ${customer.lastName}`} size="small" />
      <BlockStack gap="025">
        <Text variant="bodyMd" fontWeight="medium">
          {customer.firstName} {customer.lastName}
        </Text>
        <Text variant="bodySm" tone="subdued">
          {customer.email}
        </Text>
      </BlockStack>
    </InlineStack>,
    customer.phone || "N/A",
    formatDate(customer.createdAt),
    customer.ordersCount,
    `$${customer.totalSpent}`,
    <InlineStack gap="100" key={customer.id}>
      {customer.tags.map((tag, index) => (
        <Badge key={index} tone="info">
          {tag}
        </Badge>
      ))}
    </InlineStack>,
  ])

  return (
    <Page>
      <TitleBar title="Customers" />

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <TextField
                label="Search customers"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search by name or email..."
                clearButton
                onClearButtonClick={() => setSearchValue("")}
              />

              <DataTable
                columnContentTypes={["text", "text", "text", "numeric", "text", "text"]}
                headings={["Customer", "Phone", "Date Created", "Orders", "Total Spent", "Tags"]}
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
