import React from "react";
import { Redirect, useRouter } from "expo-router";

import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://8e2df754055b41ef82d10997d4fe1be1@o4504754173575168.ingest.sentry.io/4505232217866240",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const Root = () => {
  return <Redirect href={"/root"} />;
};

export default Root;
