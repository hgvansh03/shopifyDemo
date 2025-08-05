var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useActionData, Form, Link, useRouteError, useFetcher } from "@remix-run/react";
import { createReadableStreamFromReadable, redirect } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, AppDistribution, ApiVersion, LoginErrorType, boundary } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
import { useState, useEffect } from "react";
import { AppProvider, Page, Card, FormLayout, Text, TextField, Button, Layout, BlockStack, Link as Link$1, List, Box, ProgressBar, InlineStack, Badge, DataTable, Avatar, Select, Thumbnail, Tabs, RangeSlider, Modal } from "@shopify/polaris";
import { AppProvider as AppProvider$1 } from "@shopify/shopify-app-remix/react";
import { NavMenu, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}
const prisma = global.prismaGlobal ?? new PrismaClient();
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
ApiVersion.January25;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function App$2() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://cdn.shopify.com/" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$2
}, Symbol.toStringTag, { value: "Module" }));
const action$4 = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;
  if (session) {
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        scope: current.toString()
      }
    });
  }
  return new Response();
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  if (session) {
    await prisma.session.deleteMany({ where: { shop } });
  }
  return new Response();
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = /* @__PURE__ */ JSON.parse('{"ActionMenu":{"Actions":{"moreActions":"More actions"},"RollupActions":{"rollupButton":"View actions"}},"ActionList":{"SearchField":{"clearButtonLabel":"Clear","search":"Search","placeholder":"Search actions"}},"Avatar":{"label":"Avatar","labelWithInitials":"Avatar with initials {initials}"},"Autocomplete":{"spinnerAccessibilityLabel":"Loading","ellipsis":"{content}…"},"Badge":{"PROGRESS_LABELS":{"incomplete":"Incomplete","partiallyComplete":"Partially complete","complete":"Complete"},"TONE_LABELS":{"info":"Info","success":"Success","warning":"Warning","critical":"Critical","attention":"Attention","new":"New","readOnly":"Read-only","enabled":"Enabled"},"progressAndTone":"{toneLabel} {progressLabel}"},"Banner":{"dismissButton":"Dismiss notification"},"Button":{"spinnerAccessibilityLabel":"Loading"},"Common":{"checkbox":"checkbox","undo":"Undo","cancel":"Cancel","clear":"Clear","close":"Close","submit":"Submit","more":"More"},"ContextualSaveBar":{"save":"Save","discard":"Discard"},"DataTable":{"sortAccessibilityLabel":"sort {direction} by","navAccessibilityLabel":"Scroll table {direction} one column","totalsRowHeading":"Totals","totalRowHeading":"Total"},"DatePicker":{"previousMonth":"Show previous month, {previousMonthName} {showPreviousYear}","nextMonth":"Show next month, {nextMonth} {nextYear}","today":"Today ","start":"Start of range","end":"End of range","months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"days":{"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday"},"daysAbbreviated":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"}},"DiscardConfirmationModal":{"title":"Discard all unsaved changes","message":"If you discard changes, you’ll delete any edits you made since you last saved.","primaryAction":"Discard changes","secondaryAction":"Continue editing"},"DropZone":{"single":{"overlayTextFile":"Drop file to upload","overlayTextImage":"Drop image to upload","overlayTextVideo":"Drop video to upload","actionTitleFile":"Add file","actionTitleImage":"Add image","actionTitleVideo":"Add video","actionHintFile":"or drop file to upload","actionHintImage":"or drop image to upload","actionHintVideo":"or drop video to upload","labelFile":"Upload file","labelImage":"Upload image","labelVideo":"Upload video"},"allowMultiple":{"overlayTextFile":"Drop files to upload","overlayTextImage":"Drop images to upload","overlayTextVideo":"Drop videos to upload","actionTitleFile":"Add files","actionTitleImage":"Add images","actionTitleVideo":"Add videos","actionHintFile":"or drop files to upload","actionHintImage":"or drop images to upload","actionHintVideo":"or drop videos to upload","labelFile":"Upload files","labelImage":"Upload images","labelVideo":"Upload videos"},"errorOverlayTextFile":"File type is not valid","errorOverlayTextImage":"Image type is not valid","errorOverlayTextVideo":"Video type is not valid"},"EmptySearchResult":{"altText":"Empty search results"},"Frame":{"skipToContent":"Skip to content","navigationLabel":"Navigation","Navigation":{"closeMobileNavigationLabel":"Close navigation"}},"FullscreenBar":{"back":"Back","accessibilityLabel":"Exit fullscreen mode"},"Filters":{"moreFilters":"More filters","moreFiltersWithCount":"More filters ({count})","filter":"Filter {resourceName}","noFiltersApplied":"No filters applied","cancel":"Cancel","done":"Done","clearAllFilters":"Clear all filters","clear":"Clear","clearLabel":"Clear {filterName}","addFilter":"Add filter","clearFilters":"Clear all","searchInView":"in:{viewName}"},"FilterPill":{"clear":"Clear","unsavedChanges":"Unsaved changes - {label}"},"IndexFilters":{"searchFilterTooltip":"Search and filter","searchFilterTooltipWithShortcut":"Search and filter (F)","searchFilterAccessibilityLabel":"Search and filter results","sort":"Sort your results","addView":"Add a new view","newView":"Custom search","SortButton":{"ariaLabel":"Sort the results","tooltip":"Sort","title":"Sort by","sorting":{"asc":"Ascending","desc":"Descending","az":"A-Z","za":"Z-A"}},"EditColumnsButton":{"tooltip":"Edit columns","accessibilityLabel":"Customize table column order and visibility"},"UpdateButtons":{"cancel":"Cancel","update":"Update","save":"Save","saveAs":"Save as","modal":{"title":"Save view as","label":"Name","sameName":"A view with this name already exists. Please choose a different name.","save":"Save","cancel":"Cancel"}}},"IndexProvider":{"defaultItemSingular":"Item","defaultItemPlural":"Items","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} are selected","selected":"{selectedItemsCount} selected","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}"},"IndexTable":{"emptySearchTitle":"No {resourceNamePlural} found","emptySearchDescription":"Try changing the filters or search term","onboardingBadgeText":"New","resourceLoadingAccessibilityLabel":"Loading {resourceNamePlural}…","selectAllLabel":"Select all {resourceNamePlural}","selected":"{selectedItemsCount} selected","undo":"Undo","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural}","selectItem":"Select {resourceName}","selectButtonText":"Select","sortAccessibilityLabel":"sort {direction} by"},"Loading":{"label":"Page loading bar"},"Modal":{"iFrameTitle":"body markup","modalWarning":"These required properties are missing from Modal: {missingProps}"},"Page":{"Header":{"rollupActionsLabel":"View actions for {title}","pageReadyAccessibilityLabel":"{title}. This page is ready"}},"Pagination":{"previous":"Previous","next":"Next","pagination":"Pagination"},"ProgressBar":{"negativeWarningMessage":"Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.","exceedWarningMessage":"Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."},"ResourceList":{"sortingLabel":"Sort by","defaultItemSingular":"item","defaultItemPlural":"items","showing":"Showing {itemsCount} {resource}","showingTotalCount":"Showing {itemsCount} of {totalItemsCount} {resource}","loading":"Loading {resource}","selected":"{selectedItemsCount} selected","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} in your store are selected","allFilteredItemsSelected":"All {itemsLength}+ {resourceNamePlural} in this filter are selected","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural} in your store","selectAllFilteredItems":"Select all {itemsLength}+ {resourceNamePlural} in this filter","emptySearchResultTitle":"No {resourceNamePlural} found","emptySearchResultDescription":"Try changing the filters or search term","selectButtonText":"Select","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}","Item":{"actionsDropdownLabel":"Actions for {accessibilityLabel}","actionsDropdown":"Actions dropdown","viewItem":"View details for {itemName}"},"BulkActions":{"actionsActivatorLabel":"Actions","moreActionsActivatorLabel":"More actions"}},"SkeletonPage":{"loadingLabel":"Page loading"},"Tabs":{"newViewAccessibilityLabel":"Create new view","newViewTooltip":"Create view","toggleTabsLabel":"More views","Tab":{"rename":"Rename view","duplicate":"Duplicate view","edit":"Edit view","editColumns":"Edit columns","delete":"Delete view","copy":"Copy of {name}","deleteModal":{"title":"Delete view?","description":"This can’t be undone. {viewName} view will no longer be available in your admin.","cancel":"Cancel","delete":"Delete view"}},"RenameModal":{"title":"Rename view","label":"Name","cancel":"Cancel","create":"Save","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"DuplicateModal":{"title":"Duplicate view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"CreateViewModal":{"title":"Create new view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}}},"Tag":{"ariaLabel":"Remove {children}"},"TextField":{"characterCount":"{count} characters","characterCountWithMaxLength":"{count} of {limit} characters used"},"TooltipOverlay":{"accessibilityLabel":"Tooltip: {label}"},"TopBar":{"toggleMenuLabel":"Toggle menu","SearchField":{"clearButtonLabel":"Clear","search":"Search"}},"MediaCard":{"dismissButton":"Dismiss","popoverButton":"Actions"},"VideoThumbnail":{"playButtonA11yLabel":{"default":"Play video","defaultWithDuration":"Play video of length {duration}","duration":{"hours":{"other":{"only":"{hourCount} hours","andMinutes":"{hourCount} hours and {minuteCount} minutes","andMinute":"{hourCount} hours and {minuteCount} minute","minutesAndSeconds":"{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hours, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hours, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hours, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hours and {secondCount} seconds","andSecond":"{hourCount} hours and {secondCount} second"},"one":{"only":"{hourCount} hour","andMinutes":"{hourCount} hour and {minuteCount} minutes","andMinute":"{hourCount} hour and {minuteCount} minute","minutesAndSeconds":"{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hour, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hour, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hour, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hour and {secondCount} seconds","andSecond":"{hourCount} hour and {secondCount} second"}},"minutes":{"other":{"only":"{minuteCount} minutes","andSeconds":"{minuteCount} minutes and {secondCount} seconds","andSecond":"{minuteCount} minutes and {secondCount} second"},"one":{"only":"{minuteCount} minute","andSeconds":"{minuteCount} minute and {secondCount} seconds","andSecond":"{minuteCount} minute and {secondCount} second"}},"seconds":{"other":"{secondCount} seconds","one":"{secondCount} second"}}}}}');
const polarisTranslations = {
  Polaris
};
const polarisStyles = "/assets/styles-C7YjYK5e.css";
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const links$1 = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$b = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors, polarisTranslations };
};
const action$2 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider, { i18n: loaderData.polarisTranslations, children: /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs(FormLayout, { children: [
    /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Log in" }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        type: "text",
        name: "shop",
        label: "Shop domain",
        helpText: "example.myshopify.com",
        value: shop,
        onChange: setShop,
        autoComplete: "on",
        error: errors.shop
      }
    ),
    /* @__PURE__ */ jsx(Button, { submit: true, children: "Log in" })
  ] }) }) }) }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: Auth,
  links: links$1,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_12o3y_1";
const heading = "_heading_12o3y_11";
const text = "_text_12o3y_12";
const content = "_content_12o3y_22";
const form = "_form_12o3y_27";
const label = "_label_12o3y_35";
const input = "_input_12o3y_43";
const button = "_button_12o3y_47";
const list = "_list_12o3y_51";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$a = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};
function App$1() {
  const { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: styles.index, children: /* @__PURE__ */ jsxs("div", { className: styles.content, children: [
    /* @__PURE__ */ jsx("h1", { className: styles.heading, children: "A short heading about [your app]" }),
    /* @__PURE__ */ jsx("p", { className: styles.text, children: "A tagline about [your app] that describes your value proposition." }),
    showForm && /* @__PURE__ */ jsxs(Form, { className: styles.form, method: "post", action: "/auth/login", children: [
      /* @__PURE__ */ jsxs("label", { className: styles.label, children: [
        /* @__PURE__ */ jsx("span", { children: "Shop domain" }),
        /* @__PURE__ */ jsx("input", { className: styles.input, type: "text", name: "shop" }),
        /* @__PURE__ */ jsx("span", { children: "e.g: my-shop-domain.myshopify.com" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles.button, type: "submit", children: "Log in" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles.list, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] })
    ] })
  ] }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const loader$9 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$8 = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};
function App() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsxs(AppProvider$1, { isEmbeddedApp: true, apiKey, children: [
    /* @__PURE__ */ jsxs(NavMenu, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/app", rel: "home", children: "Dashboard" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/diamonds", children: "Diamond Inventory" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/jewelry", children: "Jewelry Settings" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/curation", children: "AI Curation" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/analytics", children: "Analytics" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/products", children: "Products" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/orders", children: "Orders" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/customers", children: "Customers" })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function ErrorBoundary() {
  return boundary.error(useRouteError());
}
const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  headers,
  links,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
function AdditionalPage() {
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Additional page" }),
    /* @__PURE__ */ jsxs(Layout, { children: [
      /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using",
          " ",
          /* @__PURE__ */ jsx(
            Link$1,
            {
              url: "https://shopify.dev/docs/apps/tools/app-bridge",
              target: "_blank",
              removeUnderline: true,
              children: "App Bridge"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "To create your own page and have it show up in the app navigation, add a page inside ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes" }),
          ", and a link to it in the ",
          /* @__PURE__ */ jsx(Code, { children: "<NavMenu>" }),
          " component found in ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes/app.jsx" }),
          "."
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Resources" }),
        /* @__PURE__ */ jsx(List, { children: /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
          Link$1,
          {
            url: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            removeUnderline: true,
            children: "App nav best practices"
          }
        ) }) })
      ] }) }) })
    ] })
  ] });
}
function Code({ children }) {
  return /* @__PURE__ */ jsx(
    Box,
    {
      as: "span",
      padding: "025",
      paddingInlineStart: "100",
      paddingInlineEnd: "100",
      background: "bg-surface-active",
      borderWidth: "025",
      borderColor: "border",
      borderRadius: "100",
      children: /* @__PURE__ */ jsx("code", { children })
    }
  );
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdditionalPage
}, Symbol.toStringTag, { value: "Module" }));
const diamondShapes = [
  "Round",
  "Princess",
  "Cushion",
  "Emerald",
  "Oval",
  "Radiant",
  "Asscher",
  "Marquise",
  "Heart",
  "Pear"
];
const mockDiamonds = [
  {
    id: "diamond_1",
    shape: "Round",
    carat: 1.25,
    color: "G",
    clarity: "VS1",
    cut: "Excellent",
    price: 8500,
    certificateNumber: "GIA-2141234567",
    videoUrl: "/placeholder.svg?height=300&width=300",
    imageUrl: "/placeholder.svg?height=300&width=300",
    measurements: "6.85 x 6.88 x 4.25 mm",
    depth: 62.1,
    table: 57,
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    type: "Natural"
  },
  {
    id: "diamond_2",
    shape: "Princess",
    carat: 1,
    color: "F",
    clarity: "VVS2",
    cut: "Excellent",
    price: 6800,
    certificateNumber: "GIA-2141234568",
    videoUrl: "/placeholder.svg?height=300&width=300",
    imageUrl: "/placeholder.svg?height=300&width=300",
    measurements: "5.45 x 5.42 x 3.98 mm",
    depth: 73.2,
    table: 68,
    polish: "Excellent",
    symmetry: "Very Good",
    fluorescence: "Faint",
    type: "Lab Grown"
  },
  {
    id: "diamond_3",
    shape: "Cushion",
    carat: 1.5,
    color: "H",
    clarity: "SI1",
    cut: "Very Good",
    price: 7200,
    certificateNumber: "GIA-2141234569",
    videoUrl: "/placeholder.svg?height=300&width=300",
    imageUrl: "/placeholder.svg?height=300&width=300",
    measurements: "6.95 x 6.88 x 4.45 mm",
    depth: 64.5,
    table: 61,
    polish: "Very Good",
    symmetry: "Good",
    fluorescence: "None",
    type: "Natural"
  }
];
const mockJewelryProducts = [
  {
    id: "jewelry_1",
    title: "Classic Solitaire Engagement Ring",
    handle: "classic-solitaire-engagement-ring",
    description: "Timeless solitaire setting perfect for showcasing your chosen diamond",
    basePrice: 1200,
    metal: "14K White Gold",
    setting: "Solitaire",
    images: ["/placeholder.svg?height=400&width=400"],
    compatibleShapes: ["Round", "Princess", "Cushion", "Oval"],
    ringSize: "6",
    category: "Engagement Rings"
  },
  {
    id: "jewelry_2",
    title: "Vintage Halo Engagement Ring",
    handle: "vintage-halo-engagement-ring",
    description: "Elegant vintage-inspired halo setting with intricate details",
    basePrice: 1800,
    metal: "18K Rose Gold",
    setting: "Halo",
    images: ["/placeholder.svg?height=400&width=400"],
    compatibleShapes: ["Round", "Cushion", "Oval", "Pear"],
    ringSize: "6.5",
    category: "Engagement Rings"
  },
  {
    id: "jewelry_3",
    title: "Three Stone Anniversary Ring",
    handle: "three-stone-anniversary-ring",
    description: "Symbolic three stone setting representing past, present, and future",
    basePrice: 2200,
    metal: "Platinum",
    setting: "Three Stone",
    images: ["/placeholder.svg?height=400&width=400"],
    compatibleShapes: ["Round", "Princess", "Emerald", "Asscher"],
    ringSize: "7",
    category: "Anniversary Rings"
  }
];
const mockCurations = [
  {
    id: "curation_1",
    jewelryId: "jewelry_1",
    recommendedDiamonds: ["diamond_1", "diamond_2"],
    reason: "Perfect size and quality match for classic solitaire setting",
    confidence: 95,
    priceRange: { min: 6800, max: 8500 },
    totalPrice: 9700
  },
  {
    id: "curation_2",
    jewelryId: "jewelry_2",
    recommendedDiamonds: ["diamond_3"],
    reason: "Cushion cut complements vintage halo design beautifully",
    confidence: 88,
    priceRange: { min: 7200, max: 7200 },
    totalPrice: 9e3
  }
];
const mockAnalytics = {
  totalDiamonds: 15420,
  totalJewelry: 245,
  avgConversionRate: "12.5%",
  avgOrderValue: "$8,750",
  topPerformingShapes: [
    { shape: "Round", percentage: 45 },
    { shape: "Princess", percentage: 18 },
    { shape: "Cushion", percentage: 15 },
    { shape: "Oval", percentage: 12 },
    { shape: "Other", percentage: 10 }
  ],
  monthlyStats: [
    { month: "Jan", sales: 125e3, orders: 18 },
    { month: "Feb", sales: 145e3, orders: 22 },
    { month: "Mar", sales: 165e3, orders: 25 },
    { month: "Apr", sales: 185e3, orders: 28 },
    { month: "May", sales: 195e3, orders: 31 },
    { month: "Jun", sales: 22e4, orders: 35 }
  ]
};
const loader$7 = async ({ request }) => {
  await authenticate.admin(request);
  return { analytics: mockAnalytics };
};
function Analytics() {
  const { analytics } = useLoaderData();
  const monthlyStatsRows = analytics.monthlyStats.map((month) => [
    month.month,
    month.orders,
    `$${month.sales.toLocaleString()}`,
    `$${Math.round(month.sales / month.orders).toLocaleString()}`,
    /* @__PURE__ */ jsx(
      ProgressBar,
      {
        progress: month.sales / Math.max(...analytics.monthlyStats.map((m) => m.sales)) * 100,
        size: "small"
      },
      month.month
    )
  ]);
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Diamond & Jewelry Analytics" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Key Performance Metrics" }),
        /* @__PURE__ */ jsxs(Layout, { children: [
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingXl", as: "h3", children: analytics.totalDiamonds.toLocaleString() }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Total Diamonds" })
          ] }) }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingXl", as: "h3", children: analytics.totalJewelry }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Jewelry Settings" })
          ] }) }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingXl", as: "h3", children: analytics.avgOrderValue }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Average Order Value" })
          ] }) }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingXl", as: "h3", children: analytics.avgConversionRate }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Conversion Rate" })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Top Performing Diamond Shapes" }),
        /* @__PURE__ */ jsx(BlockStack, { gap: "300", children: analytics.topPerformingShapes.map((shape) => /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: shape.shape }),
            /* @__PURE__ */ jsxs(Badge, { tone: "info", children: [
              shape.percentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { width: "200px" }, children: /* @__PURE__ */ jsx(ProgressBar, { progress: shape.percentage, size: "small" }) })
        ] }, shape.shape)) })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Monthly Sales Performance" }),
        /* @__PURE__ */ jsx(
          DataTable,
          {
            columnContentTypes: ["text", "numeric", "text", "text", "text"],
            headings: ["Month", "Orders", "Revenue", "AOV", "Performance"],
            rows: monthlyStatsRows
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "AI-Powered Insights" }),
        /* @__PURE__ */ jsxs(Layout, { children: [
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", tone: "success", children: "🎯 Top Recommendation" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: "Round diamonds in solitaire settings show the highest conversion rate at 18.5%. Consider promoting this combination during peak engagement season." }),
            /* @__PURE__ */ jsx(Badge, { tone: "success", children: "High Impact" })
          ] }) }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", tone: "warning", children: "⚠️ Inventory Alert" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: "Lab-grown diamonds under 1 carat are running low. Current stock will last approximately 2 weeks at current sales velocity." }),
            /* @__PURE__ */ jsx(Badge, { tone: "warning", children: "Action Required" })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Layout, { children: [
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", tone: "info", children: "📈 Growth Opportunity" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: "Cushion cut diamonds show 25% higher profit margins. Consider expanding this category and featuring in AI curations." }),
            /* @__PURE__ */ jsx(Badge, { tone: "info", children: "Opportunity" })
          ] }) }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "🤖 AI Curation Success" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: "AI-curated combinations have a 35% higher conversion rate compared to manual selections. 89% customer satisfaction score." }),
            /* @__PURE__ */ jsx(Badge, { tone: "success", children: "Performing Well" })
          ] }) }) })
        ] })
      ] }) })
    ] }) }) })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Analytics,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    title: "Wireless Bluetooth Headphones",
    handle: "wireless-bluetooth-headphones",
    status: "ACTIVE",
    vendor: "TechCorp",
    productType: "Electronics",
    tags: ["wireless", "bluetooth", "audio"],
    description: "High-quality wireless Bluetooth headphones with noise cancellation.",
    images: [
      {
        id: "gid://shopify/ProductImage/1",
        url: "/placeholder.svg?height=300&width=300",
        altText: "Wireless Bluetooth Headphones"
      }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "Black",
        price: "99.99",
        compareAtPrice: "129.99",
        sku: "WBH-001-BLK",
        inventoryQuantity: 50,
        weight: 0.5,
        weightUnit: "KILOGRAMS"
      },
      {
        id: "gid://shopify/ProductVariant/2",
        title: "White",
        price: "99.99",
        compareAtPrice: "129.99",
        sku: "WBH-001-WHT",
        inventoryQuantity: 30,
        weight: 0.5,
        weightUnit: "KILOGRAMS"
      }
    ]
  },
  {
    id: "gid://shopify/Product/2",
    title: "Organic Cotton T-Shirt",
    handle: "organic-cotton-t-shirt",
    status: "ACTIVE",
    vendor: "EcoWear",
    productType: "Apparel",
    tags: ["organic", "cotton", "sustainable"],
    description: "Comfortable organic cotton t-shirt made from sustainable materials.",
    images: [
      {
        id: "gid://shopify/ProductImage/2",
        url: "/placeholder.svg?height=300&width=300",
        altText: "Organic Cotton T-Shirt"
      }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/3",
        title: "Small / Blue",
        price: "29.99",
        compareAtPrice: null,
        sku: "OCT-001-S-BLU",
        inventoryQuantity: 25,
        weight: 0.2,
        weightUnit: "KILOGRAMS"
      },
      {
        id: "gid://shopify/ProductVariant/4",
        title: "Medium / Blue",
        price: "29.99",
        compareAtPrice: null,
        sku: "OCT-001-M-BLU",
        inventoryQuantity: 40,
        weight: 0.2,
        weightUnit: "KILOGRAMS"
      },
      {
        id: "gid://shopify/ProductVariant/5",
        title: "Large / Blue",
        price: "29.99",
        compareAtPrice: null,
        sku: "OCT-001-L-BLU",
        inventoryQuantity: 35,
        weight: 0.2,
        weightUnit: "KILOGRAMS"
      }
    ]
  },
  {
    id: "gid://shopify/Product/3",
    title: "Stainless Steel Water Bottle",
    handle: "stainless-steel-water-bottle",
    status: "ACTIVE",
    vendor: "HydroLife",
    productType: "Accessories",
    tags: ["water bottle", "stainless steel", "eco-friendly"],
    description: "Durable stainless steel water bottle that keeps drinks cold for 24 hours.",
    images: [
      {
        id: "gid://shopify/ProductImage/3",
        url: "/placeholder.svg?height=300&width=300",
        altText: "Stainless Steel Water Bottle"
      }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/6",
        title: "500ml / Silver",
        price: "24.99",
        compareAtPrice: "34.99",
        sku: "SSWB-500-SIL",
        inventoryQuantity: 60,
        weight: 0.3,
        weightUnit: "KILOGRAMS"
      },
      {
        id: "gid://shopify/ProductVariant/7",
        title: "750ml / Silver",
        price: "29.99",
        compareAtPrice: "39.99",
        sku: "SSWB-750-SIL",
        inventoryQuantity: 45,
        weight: 0.4,
        weightUnit: "KILOGRAMS"
      }
    ]
  }
];
const mockOrders = [
  {
    id: "gid://shopify/Order/1001",
    name: "#1001",
    email: "customer@example.com",
    createdAt: "2024-01-15T10:30:00Z",
    totalPrice: "129.98",
    financialStatus: "PAID",
    fulfillmentStatus: "FULFILLED",
    customer: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    lineItems: [
      {
        id: "gid://shopify/LineItem/1",
        title: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: "99.99"
      },
      {
        id: "gid://shopify/LineItem/2",
        title: "Organic Cotton T-Shirt",
        quantity: 1,
        price: "29.99"
      }
    ]
  },
  {
    id: "gid://shopify/Order/1002",
    name: "#1002",
    email: "customer2@example.com",
    createdAt: "2024-01-16T14:20:00Z",
    totalPrice: "54.98",
    financialStatus: "PAID",
    fulfillmentStatus: "UNFULFILLED",
    customer: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com"
    },
    lineItems: [
      {
        id: "gid://shopify/LineItem/3",
        title: "Stainless Steel Water Bottle",
        quantity: 2,
        price: "24.99"
      }
    ]
  }
];
const mockCustomers = [
  {
    id: "gid://shopify/Customer/1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    createdAt: "2023-12-01T00:00:00Z",
    ordersCount: 3,
    totalSpent: "299.97",
    tags: ["VIP", "Repeat Customer"],
    addresses: [
      {
        address1: "123 Main St",
        city: "New York",
        province: "NY",
        country: "United States",
        zip: "10001"
      }
    ]
  },
  {
    id: "gid://shopify/Customer/2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    createdAt: "2024-01-10T00:00:00Z",
    ordersCount: 1,
    totalSpent: "54.98",
    tags: ["New Customer"],
    addresses: [
      {
        address1: "456 Oak Ave",
        city: "Los Angeles",
        province: "CA",
        country: "United States",
        zip: "90210"
      }
    ]
  }
];
const loader$6 = async ({ request }) => {
  await authenticate.admin(request);
  return { customers: mockCustomers };
};
function Customers() {
  const { customers } = useLoaderData();
  const [searchValue, setSearchValue] = useState("");
  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = searchValue.toLowerCase();
    return customer.firstName.toLowerCase().includes(searchTerm) || customer.lastName.toLowerCase().includes(searchTerm) || customer.email.toLowerCase().includes(searchTerm);
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const rows = filteredCustomers.map((customer) => [
    /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
      /* @__PURE__ */ jsx(Avatar, { customer: true, name: `${customer.firstName} ${customer.lastName}`, size: "small" }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
        /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", fontWeight: "medium", children: [
          customer.firstName,
          " ",
          customer.lastName
        ] }),
        /* @__PURE__ */ jsx(Text, { variant: "bodySm", tone: "subdued", children: customer.email })
      ] })
    ] }, customer.id),
    customer.phone || "N/A",
    formatDate(customer.createdAt),
    customer.ordersCount,
    `$${customer.totalSpent}`,
    /* @__PURE__ */ jsx(InlineStack, { gap: "100", children: customer.tags.map((tag, index2) => /* @__PURE__ */ jsx(Badge, { tone: "info", children: tag }, index2)) }, customer.id)
  ]);
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Customers" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Search customers",
          value: searchValue,
          onChange: setSearchValue,
          placeholder: "Search by name or email...",
          clearButton: true,
          onClearButtonClick: () => setSearchValue("")
        }
      ),
      /* @__PURE__ */ jsx(
        DataTable,
        {
          columnContentTypes: ["text", "text", "text", "numeric", "text", "text"],
          headings: ["Customer", "Phone", "Date Created", "Orders", "Total Spent", "Tags"],
          rows,
          pagination: {
            hasNext: false,
            hasPrevious: false
          }
        }
      )
    ] }) }) }) })
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Customers,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const loader$5 = async ({ request }) => {
  await authenticate.admin(request);
  return {
    curations: mockCurations,
    jewelry: mockJewelryProducts,
    diamonds: mockDiamonds
  };
};
function Curation() {
  const { curations, jewelry, diamonds } = useLoaderData();
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const getJewelryById = (id) => jewelry.find((item) => item.id === id);
  const getDiamondById = (id) => diamonds.find((diamond) => diamond.id === id);
  const filteredCurations = curations.filter((curation) => {
    const jewelryItem = getJewelryById(curation.jewelryId);
    const matchesBudget = selectedBudget === "all" || selectedBudget === "under-5000" && curation.totalPrice < 5e3 || selectedBudget === "5000-10000" && curation.totalPrice >= 5e3 && curation.totalPrice <= 1e4 || selectedBudget === "over-10000" && curation.totalPrice > 1e4;
    const matchesStyle = selectedStyle === "all" || (jewelryItem == null ? void 0 : jewelryItem.setting) === selectedStyle;
    return matchesBudget && matchesStyle;
  });
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "AI Diamond Curation", children: /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => console.log("Create new curation"), children: "Create New Curation" }) }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Smart Curation Filters" }),
        /* @__PURE__ */ jsxs(InlineStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Budget Range",
              options: [
                { label: "All Budgets", value: "all" },
                { label: "Under $5,000", value: "under-5000" },
                { label: "$5,000 - $10,000", value: "5000-10000" },
                { label: "Over $10,000", value: "over-10000" }
              ],
              value: selectedBudget,
              onChange: setSelectedBudget
            }
          ),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Setting Style",
              options: [
                { label: "All Styles", value: "all" },
                { label: "Solitaire", value: "Solitaire" },
                { label: "Halo", value: "Halo" },
                { label: "Three Stone", value: "Three Stone" }
              ],
              value: selectedStyle,
              onChange: setSelectedStyle
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "AI-Curated Combinations" }),
        filteredCurations.map((curation) => {
          const jewelryItem = getJewelryById(curation.jewelryId);
          const recommendedDiamonds = curation.recommendedDiamonds.map(getDiamondById);
          return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsxs(InlineStack, { gap: "400", align: "space-between", children: [
              /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Perfect Match Found" }),
                /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                  /* @__PURE__ */ jsxs(Badge, { tone: "success", children: [
                    curation.confidence,
                    "% Confidence"
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { tone: "info", children: "AI Recommended" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "headingLg", tone: "success", children: [
                "Total: $",
                curation.totalPrice.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Layout, { children: [
              /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Jewelry Setting" }),
                /* @__PURE__ */ jsx(Thumbnail, { source: jewelryItem == null ? void 0 : jewelryItem.images[0], alt: jewelryItem == null ? void 0 : jewelryItem.title, size: "large" }),
                /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: jewelryItem == null ? void 0 : jewelryItem.title }),
                  /* @__PURE__ */ jsxs(Text, { variant: "bodySm", tone: "subdued", children: [
                    jewelryItem == null ? void 0 : jewelryItem.metal,
                    " • ",
                    jewelryItem == null ? void 0 : jewelryItem.setting
                  ] }),
                  /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                    "$",
                    jewelryItem == null ? void 0 : jewelryItem.basePrice.toLocaleString()
                  ] })
                ] })
              ] }) }) }),
              /* @__PURE__ */ jsx(Layout.Section, { variant: "twoThirds", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Recommended Diamonds" }),
                /* @__PURE__ */ jsx(Layout, { children: recommendedDiamonds.map((diamond) => /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
                  /* @__PURE__ */ jsx(
                    Thumbnail,
                    {
                      source: diamond == null ? void 0 : diamond.imageUrl,
                      alt: `${diamond == null ? void 0 : diamond.shape} Diamond`,
                      size: "medium"
                    }
                  ),
                  /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                    /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", fontWeight: "medium", children: [
                      diamond == null ? void 0 : diamond.carat,
                      "ct ",
                      diamond == null ? void 0 : diamond.shape
                    ] }),
                    /* @__PURE__ */ jsx(InlineStack, { gap: "200", children: /* @__PURE__ */ jsx(Badge, { tone: (diamond == null ? void 0 : diamond.type) === "Natural" ? "success" : "info", children: diamond == null ? void 0 : diamond.type }) }),
                    /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                      /* @__PURE__ */ jsxs(Text, { variant: "bodySm", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Color:" }),
                        " ",
                        diamond == null ? void 0 : diamond.color
                      ] }),
                      /* @__PURE__ */ jsxs(Text, { variant: "bodySm", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Clarity:" }),
                        " ",
                        diamond == null ? void 0 : diamond.clarity
                      ] }),
                      /* @__PURE__ */ jsxs(Text, { variant: "bodySm", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Cut:" }),
                        " ",
                        diamond == null ? void 0 : diamond.cut
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", tone: "success", children: [
                      "$",
                      diamond == null ? void 0 : diamond.price.toLocaleString()
                    ] })
                  ] })
                ] }) }) }, diamond == null ? void 0 : diamond.id)) })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
              /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "AI Curation Insights" }),
              /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: curation.reason }),
              /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                /* @__PURE__ */ jsx(Text, { variant: "bodySm", children: "Confidence Score" }),
                /* @__PURE__ */ jsx(ProgressBar, { progress: curation.confidence, size: "small" })
              ] }),
              /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
                /* @__PURE__ */ jsx(Button, { variant: "primary", children: "Create Product Listing" }),
                /* @__PURE__ */ jsx(Button, { children: "Save Curation" }),
                /* @__PURE__ */ jsx(Button, { children: "Share with Customer" })
              ] })
            ] }) })
          ] }) }, curation.id);
        })
      ] })
    ] }) }) }) })
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Curation,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({ request }) => {
  await authenticate.admin(request);
  return { diamonds: mockDiamonds };
};
function Diamonds() {
  const { diamonds } = useLoaderData();
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    shape: "all",
    caratRange: [0.5, 3],
    colorRange: ["D", "N"],
    clarityRange: ["FL", "I3"],
    priceRange: [1e3, 2e4],
    type: "all"
  });
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filteredDiamonds = diamonds.filter((diamond) => {
    const matchesSearch = diamond.certificateNumber.toLowerCase().includes(searchValue.toLowerCase());
    const matchesShape = filters.shape === "all" || diamond.shape === filters.shape;
    const matchesCarat = diamond.carat >= filters.caratRange[0] && diamond.carat <= filters.caratRange[1];
    const matchesPrice = diamond.price >= filters.priceRange[0] && diamond.price <= filters.priceRange[1];
    const matchesType = filters.type === "all" || diamond.type === filters.type;
    return matchesSearch && matchesShape && matchesCarat && matchesPrice && matchesType;
  });
  const tabs = [
    {
      id: "inventory",
      content: "Diamond Inventory",
      panelID: "inventory-panel"
    },
    {
      id: "comparison",
      content: "Diamond Comparison",
      panelID: "comparison-panel"
    }
  ];
  const diamondRows = filteredDiamonds.map((diamond) => [
    /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
      /* @__PURE__ */ jsx(Thumbnail, { source: diamond.imageUrl, alt: `${diamond.shape} Diamond`, size: "small" }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
        /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", fontWeight: "medium", children: [
          diamond.carat,
          "ct ",
          diamond.shape
        ] }),
        /* @__PURE__ */ jsx(Text, { variant: "bodySm", tone: "subdued", children: diamond.certificateNumber })
      ] })
    ] }, diamond.id),
    /* @__PURE__ */ jsx(Badge, { tone: diamond.type === "Natural" ? "success" : "info", children: diamond.type }, diamond.type),
    `${diamond.color} / ${diamond.clarity}`,
    diamond.cut,
    `$${diamond.price.toLocaleString()}`,
    /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
      /* @__PURE__ */ jsx(Button, { size: "slim", onClick: () => console.log("View", diamond.id), children: "View Details" }),
      /* @__PURE__ */ jsx(Button, { size: "slim", variant: "primary", onClick: () => console.log("Add to jewelry", diamond.id), children: "Add to Jewelry" })
    ] }, `actions-${diamond.id}`)
  ]);
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Diamond Inventory", children: /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => console.log("Import diamonds"), children: "Import Diamonds" }) }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(Tabs, { tabs, selected: activeTab, onSelect: setActiveTab, children: [
      activeTab === 0 && /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxs(InlineStack, { gap: "400", align: "space-between", children: [
          /* @__PURE__ */ jsx("div", { style: { flexGrow: 1 }, children: /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Search diamonds",
              value: searchValue,
              onChange: setSearchValue,
              placeholder: "Search by certificate number...",
              clearButton: true,
              onClearButtonClick: () => setSearchValue("")
            }
          ) }),
          /* @__PURE__ */ jsx(Button, { onClick: () => setShowFilters(!showFilters), children: showFilters ? "Hide Filters" : "Show Filters" })
        ] }),
        showFilters && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Filter Diamonds" }),
          /* @__PURE__ */ jsxs(Layout, { children: [
            /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(
              Select,
              {
                label: "Shape",
                options: [
                  { label: "All Shapes", value: "all" },
                  ...diamondShapes.map((shape) => ({ label: shape, value: shape }))
                ],
                value: filters.shape,
                onChange: (value) => setFilters({ ...filters, shape: value })
              }
            ) }),
            /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(
              Select,
              {
                label: "Type",
                options: [
                  { label: "All Types", value: "all" },
                  { label: "Natural", value: "Natural" },
                  { label: "Lab Grown", value: "Lab Grown" }
                ],
                value: filters.type,
                onChange: (value) => setFilters({ ...filters, type: value })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
              "Carat Range: ",
              filters.caratRange[0],
              " - ",
              filters.caratRange[1]
            ] }),
            /* @__PURE__ */ jsx(
              RangeSlider,
              {
                label: "Carat weight",
                value: filters.caratRange,
                onChange: (value) => setFilters({ ...filters, caratRange: value }),
                min: 0.5,
                max: 3,
                step: 0.1
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
              "Price Range: $",
              filters.priceRange[0].toLocaleString(),
              " - $",
              filters.priceRange[1].toLocaleString()
            ] }),
            /* @__PURE__ */ jsx(
              RangeSlider,
              {
                label: "Price range",
                value: filters.priceRange,
                onChange: (value) => setFilters({ ...filters, priceRange: value }),
                min: 1e3,
                max: 2e4,
                step: 100
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(
          DataTable,
          {
            columnContentTypes: ["text", "text", "text", "text", "text", "text"],
            headings: ["Diamond", "Type", "Color/Clarity", "Cut", "Price", "Actions"],
            rows: diamondRows,
            pagination: {
              hasNext: false,
              hasPrevious: false
            }
          }
        )
      ] }),
      activeTab === 1 && /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Compare Diamonds Side by Side" }),
        /* @__PURE__ */ jsx(Layout, { children: filteredDiamonds.slice(0, 3).map((diamond) => /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
          /* @__PURE__ */ jsx(Thumbnail, { source: diamond.imageUrl, alt: `${diamond.shape} Diamond`, size: "large" }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsxs(Text, { variant: "headingMd", children: [
              diamond.carat,
              "ct ",
              diamond.shape
            ] }),
            /* @__PURE__ */ jsx(InlineStack, { gap: "200", children: /* @__PURE__ */ jsx(Badge, { tone: diamond.type === "Natural" ? "success" : "info", children: diamond.type }) }),
            /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Color:" }),
                " ",
                diamond.color
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Clarity:" }),
                " ",
                diamond.clarity
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Cut:" }),
                " ",
                diamond.cut
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Certificate:" }),
                " ",
                diamond.certificateNumber
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Text, { variant: "headingLg", tone: "success", children: [
              "$",
              diamond.price.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "primary", fullWidth: true, children: "Select This Diamond" })
          ] })
        ] }) }) }, diamond.id)) })
      ] })
    ] }) }) }) })
  ] });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Diamonds,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async ({ request }) => {
  await authenticate.admin(request);
  return { products: mockProducts };
};
const action$1 = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const action2 = formData.get("action");
  if (action2 === "create") {
    const title = formData.get("title");
    const price = formData.get("price");
    const description = formData.get("description");
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
            variants: [{ price }]
          }
        }
      }
    );
    const responseJson = await response.json();
    return { product: responseJson.data.productCreate.product };
  }
  return null;
};
function Products() {
  const { products } = useLoaderData();
  const fetcher = useFetcher();
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: ""
  });
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const rows = filteredProducts.map((product) => {
    var _a2;
    return [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(
          Thumbnail,
          {
            source: ((_a2 = product.images[0]) == null ? void 0 : _a2.url) || "/placeholder.svg?height=40&width=40",
            alt: product.title,
            size: "small"
          }
        ),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: product.title })
      ] }, product.id),
      /* @__PURE__ */ jsx(Badge, { tone: product.status === "ACTIVE" ? "success" : "critical", children: product.status }, `status-${product.id}`),
      product.variants.length > 0 ? `$${product.variants[0].price}` : "N/A",
      product.variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0),
      product.vendor,
      /* @__PURE__ */ jsx(Button, { size: "slim", onClick: () => console.log("Edit", product.id), children: "Edit" }, `edit-${product.id}`)
    ];
  });
  const handleCreateProduct = () => {
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("title", newProduct.title);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    fetcher.submit(formData, { method: "post" });
    setShowModal(false);
    setNewProduct({ title: "", price: "", description: "" });
  };
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Products", children: /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => setShowModal(true), children: "Add Product" }) }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "400", children: [
        /* @__PURE__ */ jsx("div", { style: { flexGrow: 1 }, children: /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Search products",
            value: searchValue,
            onChange: setSearchValue,
            placeholder: "Search by product name...",
            clearButton: true,
            onClearButtonClick: () => setSearchValue("")
          }
        ) }),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Status",
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        DataTable,
        {
          columnContentTypes: ["text", "text", "text", "numeric", "text", "text"],
          headings: ["Product", "Status", "Price", "Inventory", "Vendor", "Actions"],
          rows,
          pagination: {
            hasNext: false,
            hasPrevious: false
          }
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: showModal,
        onClose: () => setShowModal(false),
        title: "Add New Product",
        primaryAction: {
          content: "Create Product",
          onAction: handleCreateProduct,
          loading: fetcher.state === "submitting"
        },
        secondaryActions: [
          {
            content: "Cancel",
            onAction: () => setShowModal(false)
          }
        ],
        children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(FormLayout, { children: [
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Product Title",
              value: newProduct.title,
              onChange: (value) => setNewProduct({ ...newProduct, title: value }),
              placeholder: "Enter product title"
            }
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Price",
              value: newProduct.price,
              onChange: (value) => setNewProduct({ ...newProduct, price: value }),
              placeholder: "0.00",
              prefix: "$",
              type: "number"
            }
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Description",
              value: newProduct.description,
              onChange: (value) => setNewProduct({ ...newProduct, description: value }),
              placeholder: "Enter product description",
              multiline: 4
            }
          )
        ] }) })
      }
    )
  ] });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Products,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({ request }) => {
  await authenticate.admin(request);
  return {
    jewelry: mockJewelryProducts,
    diamonds: mockDiamonds
  };
};
function Jewelry() {
  const { jewelry, diamonds } = useLoaderData();
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedJewelry, setSelectedJewelry] = useState(null);
  const filteredJewelry = jewelry.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const tabs = [
    {
      id: "jewelry-list",
      content: "Jewelry Settings",
      panelID: "jewelry-list-panel"
    },
    {
      id: "ai-curation",
      content: "AI Curation",
      panelID: "ai-curation-panel"
    }
  ];
  const jewelryRows = filteredJewelry.map((item) => [
    /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
      /* @__PURE__ */ jsx(Thumbnail, { source: item.images[0], alt: item.title, size: "small" }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: item.title }, `title-${item.id}`),
        /* @__PURE__ */ jsxs(Text, { variant: "bodySm", tone: "subdued", children: [
          item.metal,
          " • ",
          item.setting
        ] }, `details-${item.id}`)
      ] })
    ] }, item.id),
    /* @__PURE__ */ jsx(Badge, { tone: "info", children: item.category }, `category-${item.id}`),
    `$${item.basePrice.toLocaleString()}`,
    item.compatibleShapes.join(", "),
    /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "slim",
          onClick: () => {
            setSelectedJewelry(item);
            setShowModal(true);
          },
          children: "View Details"
        }
      ),
      /* @__PURE__ */ jsx(Button, { size: "slim", variant: "primary", onClick: () => console.log("Curate diamonds", item.id), children: "Find Diamonds" })
    ] }, `actions-${item.id}`)
  ]);
  const getRecommendedDiamonds = (jewelryItem) => {
    return diamonds.filter((diamond) => jewelryItem.compatibleShapes.includes(diamond.shape)).slice(0, 3);
  };
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Jewelry Settings", children: /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => console.log("Add jewelry"), children: "Add Jewelry Setting" }) }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(Tabs, { tabs, selected: activeTab, onSelect: setActiveTab, children: [
      activeTab === 0 && /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxs(InlineStack, { gap: "400", children: [
          /* @__PURE__ */ jsx("div", { style: { flexGrow: 1 }, children: /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Search jewelry",
              value: searchValue,
              onChange: setSearchValue,
              placeholder: "Search by jewelry name...",
              clearButton: true,
              onClearButtonClick: () => setSearchValue("")
            }
          ) }),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Category",
              options: [
                { label: "All Categories", value: "all" },
                { label: "Engagement Rings", value: "Engagement Rings" },
                { label: "Anniversary Rings", value: "Anniversary Rings" },
                { label: "Wedding Bands", value: "Wedding Bands" }
              ],
              value: categoryFilter,
              onChange: setCategoryFilter
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          DataTable,
          {
            columnContentTypes: ["text", "text", "text", "text", "text"],
            headings: ["Jewelry", "Category", "Base Price", "Compatible Shapes", "Actions"],
            rows: jewelryRows,
            pagination: {
              hasNext: false,
              hasPrevious: false
            }
          }
        )
      ] }),
      activeTab === 1 && /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "AI-Powered Diamond Curation" }),
        /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Our AI analyzes your jewelry settings and recommends the perfect diamonds based on style, proportions, and customer preferences." }),
        /* @__PURE__ */ jsx(Layout, { children: filteredJewelry.slice(0, 2).map((item) => {
          const recommendedDiamonds = getRecommendedDiamonds(item);
          return /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
              /* @__PURE__ */ jsx(Thumbnail, { source: item.images[0], alt: item.title, size: "medium" }),
              /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: item.title }, `jewelry-title-${item.id}`),
                /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: item.metal }, `jewelry-metal-${item.id}`),
                /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                  "Base: $",
                  item.basePrice.toLocaleString()
                ] }, `jewelry-base-price-${item.id}`)
              ] })
            ] }),
            /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
              /* @__PURE__ */ jsx(Text, { variant: "headingMd", children: "Recommended Diamonds" }),
              recommendedDiamonds.map((diamond) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "space-between", children: [
                /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(
                    Thumbnail,
                    {
                      source: diamond.imageUrl,
                      alt: `${diamond.shape} Diamond`,
                      size: "small"
                    }
                  ),
                  /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
                    /* @__PURE__ */ jsxs(
                      Text,
                      {
                        variant: "bodyMd",
                        fontWeight: "medium",
                        children: [
                          diamond.carat,
                          "ct ",
                          diamond.shape
                        ]
                      },
                      `diamond-carat-${diamond.id}`
                    ),
                    /* @__PURE__ */ jsxs(Text, { variant: "bodySm", tone: "subdued", children: [
                      diamond.color,
                      "/",
                      diamond.clarity,
                      " • ",
                      diamond.cut
                    ] }, `diamond-details-${diamond.id}`)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(BlockStack, { gap: "025", align: "end", children: [
                  /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", fontWeight: "medium", children: [
                    "$",
                    diamond.price.toLocaleString()
                  ] }, `diamond-price-${diamond.id}`),
                  /* @__PURE__ */ jsxs(Text, { variant: "bodySm", tone: "success", children: [
                    "Total: $",
                    (item.basePrice + diamond.price).toLocaleString()
                  ] }, `total-price-${diamond.id}`)
                ] })
              ] }) }, diamond.id)),
              /* @__PURE__ */ jsx(Button, { variant: "primary", fullWidth: true, children: "Create Complete Product" })
            ] })
          ] }) }) }, item.id);
        }) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: showModal,
        onClose: () => setShowModal(false),
        title: (selectedJewelry == null ? void 0 : selectedJewelry.title) || "Jewelry Details",
        large: true,
        children: selectedJewelry && /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(Layout, { children: [
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsx(Thumbnail, { source: selectedJewelry.images[0], alt: selectedJewelry.title, size: "large" }) }),
          /* @__PURE__ */ jsx(Layout.Section, { variant: "oneHalf", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { variant: "headingLg", children: selectedJewelry.title }, `modal-title-${selectedJewelry.id}`),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", children: selectedJewelry.description }, `modal-description-${selectedJewelry.id}`),
            /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Metal:" }),
                " ",
                selectedJewelry.metal
              ] }, `modal-metal-${selectedJewelry.id}`),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Setting Style:" }),
                " ",
                selectedJewelry.setting
              ] }, `modal-setting-${selectedJewelry.id}`),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Ring Size:" }),
                " ",
                selectedJewelry.ringSize
              ] }, `modal-ring-size-${selectedJewelry.id}`),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Compatible Shapes:" }),
                " ",
                selectedJewelry.compatibleShapes.join(", ")
              ] }, `modal-compatible-shapes-${selectedJewelry.id}`)
            ] }),
            /* @__PURE__ */ jsxs(Text, { variant: "headingMd", tone: "success", children: [
              "Base Price: $",
              selectedJewelry.basePrice.toLocaleString()
            ] }, `modal-base-price-${selectedJewelry.id}`),
            /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
              /* @__PURE__ */ jsx(Button, { variant: "primary", children: "Find Matching Diamonds" }),
              /* @__PURE__ */ jsx(Button, { children: "Edit Setting" })
            ] })
          ] }) })
        ] }) })
      }
    )
  ] });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Jewelry,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({ request }) => {
  await authenticate.admin(request);
  return {
    analytics: mockAnalytics,
    recentDiamonds: mockDiamonds.slice(0, 3),
    recentJewelry: mockJewelryProducts.slice(0, 3),
    recentCurations: mockCurations.slice(0, 2)
  };
};
const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];
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
          title: `${color} Diamond Ring`
        }
      }
    }
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
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
        variants: [{ id: variantId, price: "2500.00" }]
      }
    }
  );
  const variantResponseJson = await variantResponse.json();
  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants
  };
};
function Index() {
  var _a2, _b, _c;
  const shopify2 = useAppBridge();
  const fetcher = useFetcher();
  const { analytics, recentDiamonds, recentJewelry, recentCurations } = useLoaderData();
  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  const productId = (_b = (_a2 = fetcher.data) == null ? void 0 : _a2.product) == null ? void 0 : _b.id.replace("gid://shopify/Product/", "");
  useEffect(() => {
    if (productId) {
      shopify2.toast.show("Diamond jewelry product created");
    }
  }, [productId, shopify2]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Unbridaled Diamonds Dashboard", children: /* @__PURE__ */ jsx("button", { variant: "primary", onClick: generateProduct, children: "Create Diamond Product" }) }),
    /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxs(InlineStack, { gap: "400", align: "space-between", children: [
          /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { as: "h1", variant: "headingLg", children: "Welcome to Unbridaled Diamonds 💎" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "AI-powered diamond curation that connects your jewelry to 1 Million+ certified diamonds" })
          ] }),
          /* @__PURE__ */ jsx(Thumbnail, { source: "/placeholder.svg?height=80&width=80", alt: "Unbridaled Diamonds", size: "large" })
        ] }),
        /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
          /* @__PURE__ */ jsx(Button, { loading: isLoading, onClick: generateProduct, variant: "primary", children: "Create Diamond Product" }),
          /* @__PURE__ */ jsx(Link, { to: "/app/curation", children: /* @__PURE__ */ jsx(Button, { children: "Start AI Curation" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/app/diamonds", children: /* @__PURE__ */ jsx(Button, { children: "Browse Diamonds" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(Layout, { children: [
        /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingLg", as: "h3", children: analytics.totalDiamonds.toLocaleString() }),
          /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Available Diamonds" }),
          /* @__PURE__ */ jsx(Badge, { tone: "success", children: "Live Inventory" })
        ] }) }) }),
        /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingLg", as: "h3", children: analytics.totalJewelry }),
          /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Jewelry Settings" }),
          /* @__PURE__ */ jsx(Badge, { tone: "info", children: "Ready to Pair" })
        ] }) }) }),
        /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingLg", as: "h3", children: analytics.avgOrderValue }),
          /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Average Order Value" }),
          /* @__PURE__ */ jsx(Badge, { tone: "success", children: "+15% vs last month" })
        ] }) }) }),
        /* @__PURE__ */ jsx(Layout.Section, { variant: "oneQuarter", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx(Text, { variant: "headingLg", as: "h3", children: analytics.avgConversionRate }),
          /* @__PURE__ */ jsx(Text, { variant: "bodyMd", tone: "subdued", children: "Conversion Rate" }),
          /* @__PURE__ */ jsx(Badge, { tone: "success", children: "Above Industry Avg" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Layout, { children: [
        /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
          /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "🚀 Increase Diamond Sales with AI Curation" }),
            /* @__PURE__ */ jsx(Text, { variant: "bodyMd", as: "p", children: "Give your customers the ability to complete their diamond ring, pendant, or earring purchase on your website, all on their own! Our patented AI curation technology makes it easy. Also, use your Unbridaled powered Shopify site in-store to sell engagement rings with curated diamond options and eliminate decision overwhelm." })
          ] }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingMd", children: "Key Features" }),
            /* @__PURE__ */ jsxs(List, { type: "bullet", children: [
              /* @__PURE__ */ jsx(List.Item, { children: "Connect your jewelry to certified diamond inventory" }),
              /* @__PURE__ */ jsx(List.Item, { children: "Offer shoppers natural and/or lab grown diamonds with videos + certs to compare" }),
              /* @__PURE__ */ jsx(List.Item, { children: "Intelligent curation makes it easy for your clients to decide on a diamond" }),
              /* @__PURE__ */ jsx(List.Item, { children: "Intelligent pricing maximizes your profits while keeping prices competitive" }),
              /* @__PURE__ */ jsx(List.Item, { children: "Integrates seamlessly with your Shopify theme and branding" })
            ] })
          ] }),
          ((_c = fetcher.data) == null ? void 0 : _c.product) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingMd", children: "Latest Created Product" }),
            /* @__PURE__ */ jsx(
              Box,
              {
                padding: "400",
                background: "bg-surface-active",
                borderWidth: "025",
                borderRadius: "200",
                borderColor: "border",
                overflowX: "scroll",
                children: /* @__PURE__ */ jsx("pre", { style: { margin: 0 }, children: /* @__PURE__ */ jsx("code", { children: JSON.stringify(fetcher.data.product, null, 2) }) })
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Featured Diamonds" }),
            /* @__PURE__ */ jsx(BlockStack, { gap: "200", children: recentDiamonds.map((diamond) => /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "space-between", children: [
              /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                /* @__PURE__ */ jsx(Thumbnail, { source: diamond.imageUrl, alt: `${diamond.shape} Diamond`, size: "small" }),
                /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
                  /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", fontWeight: "medium", children: [
                    diamond.carat,
                    "ct ",
                    diamond.shape
                  ] }),
                  /* @__PURE__ */ jsxs(Text, { variant: "bodySm", tone: "subdued", children: [
                    diamond.color,
                    "/",
                    diamond.clarity
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", tone: "success", children: [
                "$",
                diamond.price.toLocaleString()
              ] })
            ] }, diamond.id)) }),
            /* @__PURE__ */ jsx(Link, { to: "/app/diamonds", children: /* @__PURE__ */ jsx(Button, { size: "slim", fullWidth: true, children: "View All Diamonds" }) })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Popular Settings" }),
            /* @__PURE__ */ jsx(BlockStack, { gap: "200", children: recentJewelry.map((jewelry) => /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "space-between", children: [
              /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                /* @__PURE__ */ jsx(Thumbnail, { source: jewelry.images[0], alt: jewelry.title, size: "small" }),
                /* @__PURE__ */ jsxs(BlockStack, { gap: "025", children: [
                  /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: jewelry.title }),
                  /* @__PURE__ */ jsx(Text, { variant: "bodySm", tone: "subdued", children: jewelry.metal })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                "$",
                jewelry.basePrice.toLocaleString()
              ] })
            ] }, jewelry.id)) }),
            /* @__PURE__ */ jsx(Link, { to: "/app/jewelry", children: /* @__PURE__ */ jsx(Button, { size: "slim", fullWidth: true, children: "View All Settings" }) })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "🤖 AI Insights" }),
            /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Top Recommendation:" }),
                " Round diamonds in solitaire settings show 18.5% conversion rate"
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Trending:" }),
                " Lab-grown diamonds up 45% this month"
              ] }),
              /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
                /* @__PURE__ */ jsx("strong", { children: "Inventory Alert:" }),
                " Cushion cuts under 1ct running low"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/app/analytics", children: /* @__PURE__ */ jsx(Button, { size: "slim", fullWidth: true, children: "View Full Analytics" }) })
          ] }) })
        ] }) })
      ] })
    ] })
  ] });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Index,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { orders: mockOrders };
};
function Orders() {
  const { orders } = useLoaderData();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.name.toLowerCase().includes(searchValue.toLowerCase()) || order.customer.email.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.fulfillmentStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const rows = filteredOrders.map((order) => [
    /* @__PURE__ */ jsx(Text, { variant: "bodyMd", fontWeight: "medium", children: order.name }, order.id),
    formatDate(order.createdAt),
    /* @__PURE__ */ jsxs(InlineStack, { gap: "100", children: [
      /* @__PURE__ */ jsxs(Text, { variant: "bodyMd", children: [
        order.customer.firstName,
        " ",
        order.customer.lastName
      ] }),
      /* @__PURE__ */ jsx(Text, { variant: "bodySm", tone: "subdued", children: order.customer.email })
    ] }, order.customer.email),
    /* @__PURE__ */ jsx(Badge, { tone: order.financialStatus === "PAID" ? "success" : "warning", children: order.financialStatus }, order.financialStatus),
    /* @__PURE__ */ jsx(Badge, { tone: order.fulfillmentStatus === "FULFILLED" ? "success" : "attention", children: order.fulfillmentStatus }, order.fulfillmentStatus),
    `$${order.totalPrice}`
  ]);
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Orders" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs(InlineStack, { gap: "400", children: [
        /* @__PURE__ */ jsx("div", { style: { flexGrow: 1 }, children: /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Search orders",
            value: searchValue,
            onChange: setSearchValue,
            placeholder: "Search by order number or customer email...",
            clearButton: true,
            onClearButtonClick: () => setSearchValue("")
          }
        ) }),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Fulfillment Status",
            options: [
              { label: "All", value: "all" },
              { label: "Fulfilled", value: "fulfilled" },
              { label: "Unfulfilled", value: "unfulfilled" }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        DataTable,
        {
          columnContentTypes: ["text", "text", "text", "text", "text", "text"],
          headings: ["Order", "Date", "Customer", "Payment", "Fulfillment", "Total"],
          rows,
          pagination: {
            hasNext: false,
            hasPrevious: false
          }
        }
      )
    ] }) }) }) })
  ] });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Orders,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DXApR9zK.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BkGpGWXJ.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js"], "css": [] }, "routes/webhooks.app.scopes_update": { "id": "routes/webhooks.app.scopes_update", "parentId": "root", "path": "webhooks/app/scopes_update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.scopes_update-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "root", "path": "webhooks/app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DW05_hhO.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/styles-BRkq6pF0.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/FormLayout-pJDZu5ec.js", "/assets/context-6NiORI7R.js", "/assets/context-CNkCKnd3.js", "/assets/context-Bxa3xaph.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-CYbXVxxW.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js"], "css": ["/assets/route-TqOIn4DE.css"] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/app-DHQX10pg.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/styles-BRkq6pF0.js", "/assets/context-6NiORI7R.js", "/assets/context-CNkCKnd3.js", "/assets/context-Bxa3xaph.js"], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-6PUBF6bs.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/Page-Ca4k7FYh.js", "/assets/TitleBar-C3pslk-9.js", "/assets/List-CihN1UK8.js", "/assets/context-6NiORI7R.js"], "css": [] }, "routes/app.analytics": { "id": "routes/app.analytics", "parentId": "routes/app", "path": "analytics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.analytics-DcfG_6QX.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/ProgressBar-DKSNIhsD.js", "/assets/Page-Ca4k7FYh.js", "/assets/TitleBar-C3pslk-9.js", "/assets/DataTable-D7lJGE9G.js", "/assets/context-6NiORI7R.js", "/assets/CSSTransition-BiEcohmw.js"], "css": [] }, "routes/app.customers": { "id": "routes/app.customers", "parentId": "routes/app", "path": "customers", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.customers-BsEsoFfh.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/context-6NiORI7R.js", "/assets/Image-DqtWbd5n.js", "/assets/TitleBar-C3pslk-9.js", "/assets/DataTable-D7lJGE9G.js"], "css": [] }, "routes/app.curation": { "id": "routes/app.curation", "parentId": "routes/app", "path": "curation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.curation-CMMpN4cE.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Select-0Rl7DaRo.js", "/assets/Thumbnail-xjyCNwAm.js", "/assets/ProgressBar-DKSNIhsD.js", "/assets/context-6NiORI7R.js", "/assets/Image-DqtWbd5n.js", "/assets/CSSTransition-BiEcohmw.js"], "css": [] }, "routes/app.diamonds": { "id": "routes/app.diamonds", "parentId": "routes/app", "path": "diamonds", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.diamonds-DXQZvh9A.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/Thumbnail-xjyCNwAm.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Tabs-rCLMjOrr.js", "/assets/Select-0Rl7DaRo.js", "/assets/context-6NiORI7R.js", "/assets/context-CNkCKnd3.js", "/assets/DataTable-D7lJGE9G.js", "/assets/Image-DqtWbd5n.js", "/assets/Modal-B0RyZzSW.js", "/assets/context-Bxa3xaph.js", "/assets/CSSTransition-BiEcohmw.js", "/assets/FormLayout-pJDZu5ec.js"], "css": [] }, "routes/app.products": { "id": "routes/app.products", "parentId": "routes/app", "path": "products", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.products-3yVtP8YL.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/Thumbnail-xjyCNwAm.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Select-0Rl7DaRo.js", "/assets/DataTable-D7lJGE9G.js", "/assets/Modal-B0RyZzSW.js", "/assets/FormLayout-pJDZu5ec.js", "/assets/context-6NiORI7R.js", "/assets/Image-DqtWbd5n.js", "/assets/context-Bxa3xaph.js", "/assets/CSSTransition-BiEcohmw.js"], "css": [] }, "routes/app.jewelry": { "id": "routes/app.jewelry", "parentId": "routes/app", "path": "jewelry", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.jewelry-Dmlu9tii.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/Thumbnail-xjyCNwAm.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Tabs-rCLMjOrr.js", "/assets/Select-0Rl7DaRo.js", "/assets/DataTable-D7lJGE9G.js", "/assets/Modal-B0RyZzSW.js", "/assets/context-6NiORI7R.js", "/assets/Image-DqtWbd5n.js", "/assets/FormLayout-pJDZu5ec.js", "/assets/context-Bxa3xaph.js", "/assets/CSSTransition-BiEcohmw.js"], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-CSBwYvpv.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Thumbnail-xjyCNwAm.js", "/assets/List-CihN1UK8.js", "/assets/context-6NiORI7R.js", "/assets/Image-DqtWbd5n.js"], "css": [] }, "routes/app.orders": { "id": "routes/app.orders", "parentId": "routes/app", "path": "orders", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.orders-Btai2ii2.js", "imports": ["/assets/index-DIrg4KX8.js", "/assets/components-4iL-Yhb0.js", "/assets/Page-Ca4k7FYh.js", "/assets/TitleBar-C3pslk-9.js", "/assets/Select-0Rl7DaRo.js", "/assets/DataTable-D7lJGE9G.js", "/assets/context-6NiORI7R.js"], "css": [] } }, "url": "/assets/manifest-70abbacd.js", "version": "70abbacd" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": true, "v3_singleFetch": false, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "root",
    path: "webhooks/app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/app.analytics": {
    id: "routes/app.analytics",
    parentId: "routes/app",
    path: "analytics",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/app.customers": {
    id: "routes/app.customers",
    parentId: "routes/app",
    path: "customers",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/app.curation": {
    id: "routes/app.curation",
    parentId: "routes/app",
    path: "curation",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/app.diamonds": {
    id: "routes/app.diamonds",
    parentId: "routes/app",
    path: "diamonds",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/app.products": {
    id: "routes/app.products",
    parentId: "routes/app",
    path: "products",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app.jewelry": {
    id: "routes/app.jewelry",
    parentId: "routes/app",
    path: "jewelry",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route14
  },
  "routes/app.orders": {
    id: "routes/app.orders",
    parentId: "routes/app",
    path: "orders",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
