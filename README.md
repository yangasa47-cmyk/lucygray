# Vercel Web Analytics

![Analytics](https://github.com/vercel/analytics/blob/main/.github/banner.png)

**Vercel Web Analytics**  
Privacy-friendly, real-time traffic insights

[Website](https://vercel.com/analytics) · [Documentation](https://vercel.com/docs/concepts/analytics/package) · [Twitter](https://twitter.com/vercel)

## Overview

`@vercel/analytics` allows you to track page views and custom events in your Next.js app or any other website that is deployed to Vercel.

All page views are automatically tracked in your app.

This package does **not** track data in development mode.

## Quickstart

1. Enable Vercel Web Analytics for a project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Add the `@vercel/analytics` package to your project
3. Inject the Analytics script to your app

   - If you are using **Next.js** or **React**, you can use the `<Analytics />` component to inject the script into your app.
   - To add the tracking script for other frameworks, use the `inject` function.
   - If you want to use Vercel Web Analytics on a static site without npm, follow the instructions in the [documentation](https://vercel.com/docs/analytics/quickstart).

4. Deploy your app to Vercel and see data flowing in.

## Documentation

Find more details about this package in our [documentation](https://vercel.com/docs/analytics/quickstart).
