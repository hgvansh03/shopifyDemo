"use client"

import { useEffect } from "react"
import { useFetcher, Link, useLoaderData } from "@remix-run/react"
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  InlineStack,
  Badge,
  Thumbnail,
} from "@shopify/polaris"
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockAnalytics, mockDiamonds, mockJewelryProducts, mockCurations } from "../../lib/diamond-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)

  return {
    analytics: mockAnalytics,
    recentDiamonds: mockDiamonds.slice(0, 3),
    recentJewelry: mockJewelryProducts.slice(0, 3),
    recentCurations: mockCurations.slice(0, 2),
  }
}

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request)
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)]
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Diamond Ring`,
        },
      },
    },
  )
  const responseJson = await response.json()
  const product = responseJson.data.productCreate.product
  const variantId = product.variants.edges[0].node.id
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "2500.00" }],
      },
    },
  )
  const variantResponseJson = await variantResponse.json()

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  }
}

export default function Index() {
  const shopify = useAppBridge()
  const fetcher = useFetcher()
  const { analytics, recentDiamonds, recentJewelry, recentCurations } = useLoaderData()
  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST"
  const productId = fetcher.data?.product?.id.replace("gid://shopify/Product/", "")

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Diamond jewelry product created")
    }
  }, [productId, shopify])

  const generateProduct = () => fetcher.submit({}, { method: "POST" })

  return (
    <Page>
      <TitleBar title="Unbridaled Diamonds Dashboard">
        <button variant="primary" onClick={generateProduct}>
          Create Diamond Product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        {/* Hero Section */}
        <Card>
          <BlockStack gap="400">
            <InlineStack gap="400" align="space-between">
              <BlockStack gap="200">
                <Text as="h1" variant="headingLg">
                  Welcome to Unbridaled Diamonds 💎
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  AI-powered diamond curation that connects your jewelry to 1 Million+ certified diamonds
                </Text>
              </BlockStack>
              <Thumbnail source="/placeholder.svg?height=80&width=80" alt="Unbridaled Diamonds" size="large" />
            </InlineStack>

            <InlineStack gap="300">
              <Button loading={isLoading} onClick={generateProduct} variant="primary">
                Create Diamond Product
              </Button>
              <Link to="/app/curation">
                <Button>Start AI Curation</Button>
              </Link>
              <Link to="/app/diamonds">
                <Button>Browse Diamonds</Button>
              </Link>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Quick Stats */}
        <Layout>
          <Layout.Section variant="oneQuarter">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingLg" as="h3">
                  {analytics.totalDiamonds.toLocaleString()}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Available Diamonds
                </Text>
                <Badge tone="success">Live Inventory</Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneQuarter">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingLg" as="h3">
                  {analytics.totalJewelry}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Jewelry Settings
                </Text>
                <Badge tone="info">Ready to Pair</Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneQuarter">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingLg" as="h3">
                  {analytics.avgOrderValue}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Average Order Value
                </Text>
                <Badge tone="success">+15% vs last month</Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneQuarter">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingLg" as="h3">
                  {analytics.avgConversionRate}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Conversion Rate
                </Text>
                <Badge tone="success">Above Industry Avg</Badge>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    🚀 Increase Diamond Sales with AI Curation
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Give your customers the ability to complete their diamond ring, pendant, or earring purchase on your
                    website, all on their own! Our patented AI curation technology makes it easy. Also, use your
                    Unbridaled powered Shopify site in-store to sell engagement rings with curated diamond options and
                    eliminate decision overwhelm.
                  </Text>
                </BlockStack>

                <BlockStack gap="300">
                  <Text as="h3" variant="headingMd">
                    Key Features
                  </Text>
                  <List type="bullet">
                    <List.Item>Connect your jewelry to certified diamond inventory</List.Item>
                    <List.Item>
                      Offer shoppers natural and/or lab grown diamonds with videos + certs to compare
                    </List.Item>
                    <List.Item>Intelligent curation makes it easy for your clients to decide on a diamond</List.Item>
                    <List.Item>Intelligent pricing maximizes your profits while keeping prices competitive</List.Item>
                    <List.Item>Integrates seamlessly with your Shopify theme and branding</List.Item>
                  </List>
                </BlockStack>

                {fetcher.data?.product && (
                  <>
                    <Text as="h3" variant="headingMd">
                      Latest Created Product
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              {/* Recent Diamonds */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Featured Diamonds
                  </Text>
                  <BlockStack gap="200">
                    {recentDiamonds.map((diamond) => (
                      <InlineStack key={diamond.id} gap="300" align="space-between">
                        <InlineStack gap="200">
                          <Thumbnail source={diamond.imageUrl} alt={`${diamond.shape} Diamond`} size="small" />
                          <BlockStack gap="025">
                            <Text variant="bodyMd" fontWeight="medium">
                              {diamond.carat}ct {diamond.shape}
                            </Text>
                            <Text variant="bodySm" tone="subdued">
                              {diamond.color}/{diamond.clarity}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                        <Text variant="bodyMd" tone="success">
                          ${diamond.price.toLocaleString()}
                        </Text>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  <Link to="/app/diamonds">
                    <Button size="slim" fullWidth>
                      View All Diamonds
                    </Button>
                  </Link>
                </BlockStack>
              </Card>

              {/* Recent Jewelry */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Popular Settings
                  </Text>
                  <BlockStack gap="200">
                    {recentJewelry.map((jewelry) => (
                      <InlineStack key={jewelry.id} gap="300" align="space-between">
                        <InlineStack gap="200">
                          <Thumbnail source={jewelry.images[0]} alt={jewelry.title} size="small" />
                          <BlockStack gap="025">
                            <Text variant="bodyMd" fontWeight="medium">
                              {jewelry.title}
                            </Text>
                            <Text variant="bodySm" tone="subdued">
                              {jewelry.metal}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                        <Text variant="bodyMd">${jewelry.basePrice.toLocaleString()}</Text>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  <Link to="/app/jewelry">
                    <Button size="slim" fullWidth>
                      View All Settings
                    </Button>
                  </Link>
                </BlockStack>
              </Card>

              {/* AI Insights */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    🤖 AI Insights
                  </Text>
                  <BlockStack gap="200">
                    <Text variant="bodyMd">
                      <strong>Top Recommendation:</strong> Round diamonds in solitaire settings show 18.5% conversion
                      rate
                    </Text>
                    <Text variant="bodyMd">
                      <strong>Trending:</strong> Lab-grown diamonds up 45% this month
                    </Text>
                    <Text variant="bodyMd">
                      <strong>Inventory Alert:</strong> Cushion cuts under 1ct running low
                    </Text>
                  </BlockStack>
                  <Link to="/app/analytics">
                    <Button size="slim" fullWidth>
                      View Full Analytics
                    </Button>
                  </Link>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  )
}
