# MongoDB Setup

## 1. Create the new database

In MongoDB Atlas:

1. Open the cluster and choose **Browse Collections**.
2. Choose **Create Database**.
3. Use a database name such as `my_store` and create an initial collection.

MongoDB creates databases when the first document is inserted, so an empty database is also valid.

## 2. Create an application user

In **Database Access**, create a user with a strong password. Grant read/write access to the new database. Do not commit this password to source control.

## 3. Allow the backend to connect

In **Network Access**, add the IP address of the machine running the Node API. For local-only testing, add your current public IP. Avoid `0.0.0.0/0` except for temporary testing.

## 4. Set the backend environment

Copy `.env.example` to `.env` and replace the placeholders:

```text
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_HOST/my_store?retryWrites=true&w=majority
```

If the password contains characters such as `@`, `#`, `/`, or `:`, URL-encode it first. Alternatively, keep the cluster URI and set:

```text
MONGO_DB_NAME=my_store
```

## 5. Add payment gateway configuration

The payment code reads an active document from the `bankgatewayinfos` collection. It filters by:

- `domin_id`: `1` for the current checkout flow
- `active`: `true`

The document also needs the Cashfree test values (`test_app_id`, `test_app_secret`, `gateway_test_url`) and a `redirect_success_url`. Use sandbox credentials for local testing.

## 6. Start and verify

From `node_ecommerce-main/node_ecommerce-main` run:

```text
npm start
```

Then open `http://localhost:5000/api/health`. The response should show `"database":"connected"`. The React app can continue using `http://localhost:5000` in its frontend `.env`.