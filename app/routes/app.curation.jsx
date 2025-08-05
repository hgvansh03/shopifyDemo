"use client"

import { useState } from "react"
import { useLoaderData } from "@remix-run/react"
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Thumbnail,
  ProgressBar,
  Select,
} from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockCurations, mockJewelryProducts, mockDiamonds } from "../../lib/diamond-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)
  return {
    curations: mockCurations,
    jewelry: mockJewelryProducts,
    diamonds: mockDiamonds,
  }
}

export default function Curation() {
  const { curations, jewelry, diamonds } = useLoaderData()
  const [selectedBudget, setSelectedBudget] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")

  const getJewelryById = (id) => jewelry.find((item) => item.id === id)
  const getDiamondById = (id) => diamonds.find((diamond) => diamond.id === id)

  const filteredCurations = curations.filter((curation) => {
    const jewelryItem = getJewelryById(curation.jewelryId)
    const matchesBudget =
      selectedBudget === "all" ||
      (selectedBudget === "under-5000" && curation.totalPrice < 5000) ||
      (selectedBudget === "5000-10000" && curation.totalPrice >= 5000 && curation.totalPrice <= 10000) ||
      (selectedBudget === "over-10000" && curation.totalPrice > 10000)

    const matchesStyle = selectedStyle === "all" || jewelryItem?.setting === selectedStyle

    return matchesBudget && matchesStyle
  })

  return (
    <Page>
      <TitleBar title="AI Diamond Curation">
        <Button variant="primary" onClick={() => console.log("Create new curation")}>
          Create New Curation
        </Button>
      </TitleBar>

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="300">
                <Text variant="headingMd">Smart Curation Filters</Text>
                <InlineStack gap="400">
                  <Select
                    label="Budget Range"
                    options={[
                      { label: "All Budgets", value: "all" },
                      { label: "Under $5,000", value: "under-5000" },
                      { label: "$5,000 - $10,000", value: "5000-10000" },
                      { label: "Over $10,000", value: "over-10000" },
                    ]}
                    value={selectedBudget}
                    onChange={setSelectedBudget}
                  />
                  <Select
                    label="Setting Style"
                    options={[
                      { label: "All Styles", value: "all" },
                      { label: "Solitaire", value: "Solitaire" },
                      { label: "Halo", value: "Halo" },
                      { label: "Three Stone", value: "Three Stone" },
                    ]}
                    value={selectedStyle}
                    onChange={setSelectedStyle}
                  />
                </InlineStack>
              </BlockStack>

              <BlockStack gap="400">
                <Text variant="headingMd">AI-Curated Combinations</Text>
                {filteredCurations.map((curation) => {
                  const jewelryItem = getJewelryById(curation.jewelryId)
                  const recommendedDiamonds = curation.recommendedDiamonds.map(getDiamondById)

                  return (
                    <Card key={curation.id}>
                      <BlockStack gap="400">
                        <InlineStack gap="400" align="space-between">
                          <BlockStack gap="200">
                            <Text variant="headingMd">Perfect Match Found</Text>
                            <InlineStack gap="200">
                              <Badge tone="success">{curation.confidence}% Confidence</Badge>
                              <Badge tone="info">AI Recommended</Badge>
                            </InlineStack>
                          </BlockStack>
                          <Text variant="headingLg" tone="success">
                            Total: ${curation.totalPrice.toLocaleString()}
                          </Text>
                        </InlineStack>

                        <Layout>
                          <Layout.Section variant="oneThird">
                            <Card>
                              <BlockStack gap="300">
                                <Text variant="headingMd">Jewelry Setting</Text>
                                <Thumbnail source={jewelryItem?.images[0]} alt={jewelryItem?.title} size="large" />
                                <BlockStack gap="200">
                                  <Text variant="bodyMd" fontWeight="medium">
                                    {jewelryItem?.title}
                                  </Text>
                                  <Text variant="bodySm" tone="subdued">
                                    {jewelryItem?.metal} • {jewelryItem?.setting}
                                  </Text>
                                  <Text variant="bodyMd">${jewelryItem?.basePrice.toLocaleString()}</Text>
                                </BlockStack>
                              </BlockStack>
                            </Card>
                          </Layout.Section>

                          <Layout.Section variant="twoThirds">
                            <Card>
                              <BlockStack gap="300">
                                <Text variant="headingMd">Recommended Diamonds</Text>
                                <Layout>
                                  {recommendedDiamonds.map((diamond) => (
                                    <Layout.Section variant="oneHalf" key={diamond?.id}>
                                      <Card>
                                        <BlockStack gap="300">
                                          <Thumbnail
                                            source={diamond?.imageUrl}
                                            alt={`${diamond?.shape} Diamond`}
                                            size="medium"
                                          />
                                          <BlockStack gap="200">
                                            <Text variant="bodyMd" fontWeight="medium">
                                              {diamond?.carat}ct {diamond?.shape}
                                            </Text>
                                            <InlineStack gap="200">
                                              <Badge tone={diamond?.type === "Natural" ? "success" : "info"}>
                                                {diamond?.type}
                                              </Badge>
                                            </InlineStack>
                                            <BlockStack gap="100">
                                              <Text variant="bodySm">
                                                <strong>Color:</strong> {diamond?.color}
                                              </Text>
                                              <Text variant="bodySm">
                                                <strong>Clarity:</strong> {diamond?.clarity}
                                              </Text>
                                              <Text variant="bodySm">
                                                <strong>Cut:</strong> {diamond?.cut}
                                              </Text>
                                            </BlockStack>
                                            <Text variant="bodyMd" tone="success">
                                              ${diamond?.price.toLocaleString()}
                                            </Text>
                                          </BlockStack>
                                        </BlockStack>
                                      </Card>
                                    </Layout.Section>
                                  ))}
                                </Layout>
                              </BlockStack>
                            </Card>
                          </Layout.Section>
                        </Layout>

                        <Card>
                          <BlockStack gap="300">
                            <Text variant="headingMd">AI Curation Insights</Text>
                            <Text variant="bodyMd">{curation.reason}</Text>
                            <BlockStack gap="200">
                              <Text variant="bodySm">Confidence Score</Text>
                              <ProgressBar progress={curation.confidence} size="small" />
                            </BlockStack>
                            <InlineStack gap="300">
                              <Button variant="primary">Create Product Listing</Button>
                              <Button>Save Curation</Button>
                              <Button>Share with Customer</Button>
                            </InlineStack>
                          </BlockStack>
                        </Card>
                      </BlockStack>
                    </Card>
                  )
                })}
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
