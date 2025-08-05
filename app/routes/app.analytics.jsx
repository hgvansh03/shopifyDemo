import { useLoaderData } from "@remix-run/react"
import { Page, Layout, Card, Text, BlockStack, InlineStack, DataTable, ProgressBar, Badge } from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { authenticate } from "../shopify.server"
import { mockAnalytics } from "../../lib/diamond-data"

export const loader = async ({ request }) => {
  await authenticate.admin(request)
  return { analytics: mockAnalytics }
}

export default function Analytics() {
  const { analytics } = useLoaderData()

  const monthlyStatsRows = analytics.monthlyStats.map((month) => [
    month.month,
    month.orders,
    `$${month.sales.toLocaleString()}`,
    `$${Math.round(month.sales / month.orders).toLocaleString()}`,
    <ProgressBar
      key={month.month}
      progress={(month.sales / Math.max(...analytics.monthlyStats.map((m) => m.sales))) * 100}
      size="small"
    />,
  ])

  return (
    <Page>
      <TitleBar title="Diamond & Jewelry Analytics" />

      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Key Metrics */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Key Performance Metrics
                </Text>
                <Layout>
                  <Layout.Section variant="oneQuarter">
                    <Card>
                      <BlockStack gap="200">
                        <Text variant="headingXl" as="h3">
                          {analytics.totalDiamonds.toLocaleString()}
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Total Diamonds
                        </Text>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                  <Layout.Section variant="oneQuarter">
                    <Card>
                      <BlockStack gap="200">
                        <Text variant="headingXl" as="h3">
                          {analytics.totalJewelry}
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Jewelry Settings
                        </Text>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                  <Layout.Section variant="oneQuarter">
                    <Card>
                      <BlockStack gap="200">
                        <Text variant="headingXl" as="h3">
                          {analytics.avgOrderValue}
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Average Order Value
                        </Text>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                  <Layout.Section variant="oneQuarter">
                    <Card>
                      <BlockStack gap="200">
                        <Text variant="headingXl" as="h3">
                          {analytics.avgConversionRate}
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Conversion Rate
                        </Text>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                </Layout>
              </BlockStack>
            </Card>

            {/* Diamond Shape Performance */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Top Performing Diamond Shapes
                </Text>
                <BlockStack gap="300">
                  {analytics.topPerformingShapes.map((shape) => (
                    <InlineStack key={shape.shape} align="space-between">
                      <InlineStack gap="300">
                        <Text variant="bodyMd" fontWeight="medium">
                          {shape.shape}
                        </Text>
                        <Badge tone="info">{shape.percentage}%</Badge>
                      </InlineStack>
                      <div style={{ width: "200px" }}>
                        <ProgressBar progress={shape.percentage} size="small" />
                      </div>
                    </InlineStack>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Monthly Performance */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Monthly Sales Performance
                </Text>
                <DataTable
                  columnContentTypes={["text", "numeric", "text", "text", "text"]}
                  headings={["Month", "Orders", "Revenue", "AOV", "Performance"]}
                  rows={monthlyStatsRows}
                />
              </BlockStack>
            </Card>

            {/* AI Insights */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  AI-Powered Insights
                </Text>
                <Layout>
                  <Layout.Section variant="oneHalf">
                    <Card>
                      <BlockStack gap="300">
                        <Text variant="headingMd" tone="success">
                          🎯 Top Recommendation
                        </Text>
                        <Text variant="bodyMd">
                          Round diamonds in solitaire settings show the highest conversion rate at 18.5%. Consider
                          promoting this combination during peak engagement season.
                        </Text>
                        <Badge tone="success">High Impact</Badge>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                  <Layout.Section variant="oneHalf">
                    <Card>
                      <BlockStack gap="300">
                        <Text variant="headingMd" tone="warning">
                          ⚠️ Inventory Alert
                        </Text>
                        <Text variant="bodyMd">
                          Lab-grown diamonds under 1 carat are running low. Current stock will last approximately 2
                          weeks at current sales velocity.
                        </Text>
                        <Badge tone="warning">Action Required</Badge>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                </Layout>

                <Layout>
                  <Layout.Section variant="oneHalf">
                    <Card>
                      <BlockStack gap="300">
                        <Text variant="headingMd" tone="info">
                          📈 Growth Opportunity
                        </Text>
                        <Text variant="bodyMd">
                          Cushion cut diamonds show 25% higher profit margins. Consider expanding this category and
                          featuring in AI curations.
                        </Text>
                        <Badge tone="info">Opportunity</Badge>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                  <Layout.Section variant="oneHalf">
                    <Card>
                      <BlockStack gap="300">
                        <Text variant="headingMd">🤖 AI Curation Success</Text>
                        <Text variant="bodyMd">
                          AI-curated combinations have a 35% higher conversion rate compared to manual selections. 89%
                          customer satisfaction score.
                        </Text>
                        <Badge tone="success">Performing Well</Badge>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                </Layout>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
