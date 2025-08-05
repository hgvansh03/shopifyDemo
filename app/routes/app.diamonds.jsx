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
  Thumbnail,
  RangeSlider,
  Tabs,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockDiamonds, diamondShapes } from "../../lib/diamond-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)
  return { diamonds: mockDiamonds }
}

export default function Diamonds() {
  const { diamonds } = useLoaderData()
  const [activeTab, setActiveTab] = useState(0)
  const [filters, setFilters] = useState({
    shape: "all",
    caratRange: [0.5, 3.0],
    colorRange: ["D", "N"],
    clarityRange: ["FL", "I3"],
    priceRange: [1000, 20000],
    type: "all",
  })
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredDiamonds = diamonds.filter((diamond) => {
    const matchesSearch = diamond.certificateNumber.toLowerCase().includes(searchValue.toLowerCase())
    const matchesShape = filters.shape === "all" || diamond.shape === filters.shape
    const matchesCarat = diamond.carat >= filters.caratRange[0] && diamond.carat <= filters.caratRange[1]
    const matchesPrice = diamond.price >= filters.priceRange[0] && diamond.price <= filters.priceRange[1]
    const matchesType = filters.type === "all" || diamond.type === filters.type

    return matchesSearch && matchesShape && matchesCarat && matchesPrice && matchesType
  })

  const tabs = [
    {
      id: "inventory",
      content: "Diamond Inventory",
      panelID: "inventory-panel",
    },
    {
      id: "comparison",
      content: "Diamond Comparison",
      panelID: "comparison-panel",
    },
  ]

  const diamondRows = filteredDiamonds.map((diamond) => [
    <InlineStack gap="300" key={diamond.id}>
      <Thumbnail source={diamond.imageUrl} alt={`${diamond.shape} Diamond`} size="small" />
      <BlockStack gap="025">
        <Text variant="bodyMd" fontWeight="medium">
          {diamond.carat}ct {diamond.shape}
        </Text>
        <Text variant="bodySm" tone="subdued">
          {diamond.certificateNumber}
        </Text>
      </BlockStack>
    </InlineStack>,
    <Badge tone={diamond.type === "Natural" ? "success" : "info"} key={diamond.type}>
      {diamond.type}
    </Badge>,
    `${diamond.color} / ${diamond.clarity}`,
    diamond.cut,
    `$${diamond.price.toLocaleString()}`,
    <InlineStack gap="200" key={`actions-${diamond.id}`}>
      <Button size="slim" onClick={() => console.log("View", diamond.id)}>
        View Details
      </Button>
      <Button size="slim" variant="primary" onClick={() => console.log("Add to jewelry", diamond.id)}>
        Add to Jewelry
      </Button>
    </InlineStack>,
  ])

  return (
    <Page>
      <TitleBar title="Diamond Inventory">
        <Button variant="primary" onClick={() => console.log("Import diamonds")}>
          Import Diamonds
        </Button>
      </TitleBar>

      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
              {activeTab === 0 && (
                <BlockStack gap="400">
                  <InlineStack gap="400" align="space-between">
                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        label="Search diamonds"
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="Search by certificate number..."
                        clearButton
                        onClearButtonClick={() => setSearchValue("")}
                      />
                    </div>
                    <Button onClick={() => setShowFilters(!showFilters)}>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </InlineStack>

                  {showFilters && (
                    <Card>
                      <BlockStack gap="400">
                        <Text variant="headingMd">Filter Diamonds</Text>
                        <Layout>
                          <Layout.Section variant="oneThird">
                            <Select
                              label="Shape"
                              options={[
                                { label: "All Shapes", value: "all" },
                                ...diamondShapes.map((shape) => ({ label: shape, value: shape })),
                              ]}
                              value={filters.shape}
                              onChange={(value) => setFilters({ ...filters, shape: value })}
                            />
                          </Layout.Section>
                          <Layout.Section variant="oneThird">
                            <Select
                              label="Type"
                              options={[
                                { label: "All Types", value: "all" },
                                { label: "Natural", value: "Natural" },
                                { label: "Lab Grown", value: "Lab Grown" },
                              ]}
                              value={filters.type}
                              onChange={(value) => setFilters({ ...filters, type: value })}
                            />
                          </Layout.Section>
                        </Layout>

                        <BlockStack gap="300">
                          <Text variant="bodyMd">
                            Carat Range: {filters.caratRange[0]} - {filters.caratRange[1]}
                          </Text>
                          <RangeSlider
                            label="Carat weight"
                            value={filters.caratRange}
                            onChange={(value) => setFilters({ ...filters, caratRange: value })}
                            min={0.5}
                            max={3.0}
                            step={0.1}
                          />
                        </BlockStack>

                        <BlockStack gap="300">
                          <Text variant="bodyMd">
                            Price Range: ${filters.priceRange[0].toLocaleString()} - $
                            {filters.priceRange[1].toLocaleString()}
                          </Text>
                          <RangeSlider
                            label="Price range"
                            value={filters.priceRange}
                            onChange={(value) => setFilters({ ...filters, priceRange: value })}
                            min={1000}
                            max={20000}
                            step={100}
                          />
                        </BlockStack>
                      </BlockStack>
                    </Card>
                  )}

                  <DataTable
                    columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                    headings={["Diamond", "Type", "Color/Clarity", "Cut", "Price", "Actions"]}
                    rows={diamondRows}
                    pagination={{
                      hasNext: false,
                      hasPrevious: false,
                    }}
                  />
                </BlockStack>
              )}

              {activeTab === 1 && (
                <BlockStack gap="400">
                  <Text variant="headingMd">Compare Diamonds Side by Side</Text>
                  <Layout>
                    {filteredDiamonds.slice(0, 3).map((diamond) => (
                      <Layout.Section variant="oneThird" key={diamond.id}>
                        <Card>
                          <BlockStack gap="300">
                            <Thumbnail source={diamond.imageUrl} alt={`${diamond.shape} Diamond`} size="large" />
                            <BlockStack gap="200">
                              <Text variant="headingMd">
                                {diamond.carat}ct {diamond.shape}
                              </Text>
                              <InlineStack gap="200">
                                <Badge tone={diamond.type === "Natural" ? "success" : "info"}>{diamond.type}</Badge>
                              </InlineStack>
                              <BlockStack gap="100">
                                <Text variant="bodyMd">
                                  <strong>Color:</strong> {diamond.color}
                                </Text>
                                <Text variant="bodyMd">
                                  <strong>Clarity:</strong> {diamond.clarity}
                                </Text>
                                <Text variant="bodyMd">
                                  <strong>Cut:</strong> {diamond.cut}
                                </Text>
                                <Text variant="bodyMd">
                                  <strong>Certificate:</strong> {diamond.certificateNumber}
                                </Text>
                              </BlockStack>
                              <Text variant="headingLg" tone="success">
                                ${diamond.price.toLocaleString()}
                              </Text>
                              <Button variant="primary" fullWidth>
                                Select This Diamond
                              </Button>
                            </BlockStack>
                          </BlockStack>
                        </Card>
                      </Layout.Section>
                    ))}
                  </Layout>
                </BlockStack>
              )}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
