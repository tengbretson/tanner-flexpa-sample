## Tanner Engbretson's Flexpa demo

This Tanner Engbretson's submission for Flexpa's developer evaluation project. This was created using next.js with Node.js v20.5.0.

### What you will need:

You will need to add a `.env.local` file to the root of this project containing your key and secret for using Flexpa in "Test mode."

It should resemble something like this:

```Dotenv
NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY=pk_test_notyokeys
FLEXPA_SECRET_KEY=sk_test_nachocheese
```

\*the secret key is not made available to the next.js frontend.

You can run this project by building and then launching the server:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What it does?

This page will prompt you to connect to your insurance to display your data. Clicking the `Connect` button will launch the Flexpa Link dialog and lead you through the auth flow for your insurer.

After the public-token is retrieved from Flexpa, the front-end will call to the `/access-token` endpoint to exchange the public token for the access-token jwt. This is then used to authenticate a call to retrieve all EOBs for the authorized patient. It then shows a list of that patient's EOBs with hopefully something useful shown along the way.

## Tests

There is a small set of non-exhaustive integrations tests. They can be run by first launching the server:

```bash
npm install
npm run build
npm start
```

Then, in another terminal, run:

```bash
npm run test:e2e
```

This may warn you that playwright is not installed. If so, run:

```bash
npx playwright install
```

This runs a headless browser that checks that the rendered UI meets some very coarse requirements. I initially implemented a few more thorough tests that go all the way through to the display of the EOBs, but their reliance on external services' API calls made them simply too flakey to be useful.

With more time I would like to implement tests for the api endpoints by stubbing the underlying calls to api.flexpa.com.

## Points worth mentioning

- This application does not handle token expiry and refreshes. With more time, it is certainly something that I would have liked to address.

- The data hygiene/consistency for the resources returned leaves something to be desired. For the sake of speed, I made some decisions that make data from some providers appear worse than others. For the best results, I would suggest testing with `Aetna`'s sandbox data.

- I wanted to validate type correctness of the data I was receiving, and I didn't have time to implement it myself, so I used something called `@ahryman40k/ts-fhir-types`. It seems to work pretty slick, but it does not seem to believe that all of the search results you get from `Kaiser Permanente` are valid. It would be interesting to discover why that might be.

- There are a few cases where I used `Math.random()` as the key prop in a mapped-array of React components. This is not ideal, but I could not validate that the fields I was mapping over had any consistent property that could uniquely identify them.

- Part way through working on this my Flexpa integration lost the ability to connect to the Flexpa test FHIR server. Not sure what that's all about.

- Before I fully understood what was meant by the `Wildcard parameters` section of the documentation, I originally implemented my EOB search by decoding the JWT and making a `/fhir/ExplanationOfBenefits?patient=<actual-id>` call. When making this call I received a bundle that was the correct size, but only held reference urls that each just pointed to the actual search call I had made. No actual EOB resources were coming down the line. Not sure if that's something I did wrong or a bug.
