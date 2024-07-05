import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import LogRocket from 'logrocket';
import * as Sentry from "@sentry/vue";

LogRocket.init('5sgire/nerdnextdoor');


const app = createApp(App);


Sentry.init({
    app,
    dsn: "https://dfe36aa0011b1f7ae36533f53d53816e@o4507547819573248.ingest.de.sentry.io/4507547821146192",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

app.use(createPinia());
app.use(router);

app.mount('#app');
