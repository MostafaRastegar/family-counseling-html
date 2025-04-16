"use client";

import type { ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as QueryClientPro,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import {
  NotificationContextProvider,
  useNotificationContext,
} from "papak/configs/notificationContextProvider";

function QueryClientContextProvider({ children, blacklist, language }: IProps) {
  const { openNotificationWithIcon } = useNotificationContext();
  const errorTitle = language === "fa" ? GET_ERROR_MESSAGE : "Error";
  const successTitle = language === "fa" ? "موفقیت" : "Successful";
  const client = new QueryClient({
    queryCache: new QueryCache({
      onSettled: (data, error, { options: { meta } }) => {
        const requestURL = (data as any)?.config?.url;

        const { errorMessage, successMessage, disableNotification } =
          (meta as unknown as IMeta) ?? {};

        if (
          blacklist?.some((str) => requestURL?.includes(str)) ||
          disableNotification
        ) {
          return null;
        }

        if (error) {
          openNotificationWithIcon(
            "error",
            errorMessage?.title ?? errorTitle,
            errorMessage?.body ?? error.message
          );
          return error;
        }
        if (successMessage) {
          openNotificationWithIcon(
            "success",
            successMessage?.title,
            successMessage?.body
          );
        }
      },
    }),
    mutationCache: new MutationCache({
      onSettled(data, error, variables, context, { options: { meta } }) {
        const { errorMessage, successMessage, disableNotification } =
          (meta as unknown as IMeta) ?? {};

        if (error) {
          openNotificationWithIcon(
            "error",
            errorMessage?.title ?? errorTitle,
            errorMessage?.body ?? error.message
          );
          return error;
        }

        const { url: requestURL, method } = (data as any)?.config;

        if (
          blacklist?.some((str) => requestURL?.includes(str)) ||
          disableNotification
        ) {
          return null;
        }

        openNotificationWithIcon(
          "success",
          successMessage?.title || successTitle,
          successMessage?.body ||
            (data as any)?.data?.message ||
            methodMessages(language)[method as RequestMethodType] ||
            "Job successfully"
        );
      },
    }),
    defaultOptions: {
      queries: { retry: 2 },
    },
  });
  return (
    <QueryClientPro client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientPro>
  );
}

function QueryClientProvider({ children, blacklist, language }: IProps) {
  return (
    <NotificationContextProvider>
      <QueryClientContextProvider blacklist={blacklist} language={language}>
        {children}
      </QueryClientContextProvider>
    </NotificationContextProvider>
  );
}

interface IProps {
  blacklist?: string[];
  children: ReactNode;
  language?: "fa" | "en";
}

type RequestMethodType = "put" | "patch" | "post" | "delete";

export interface IMeta {
  successMessage: { title: string; body: ReactNode };
  errorMessage: { title: string; body: ReactNode };

  disableNotification?: boolean;
  method?: RequestMethodType;
}

const methodMessages = (lang: "fa" | "en" = "en") => ({
  put: lang === "en" ? "Item successfully updated." : "با موفقیت بروزرسانی شد.",
  patch:
    lang === "en" ? "Item successfully updated." : "با موفقیت بروزرسانی شد.",
  post: lang === "en" ? "Item successfully created." : "با موفقیت ایجاد شد.",
  delete: lang === "en" ? "Item successfully removed." : "با موفقیت حذف شد.",
});

const GET_ERROR_MESSAGE = "خطایی در دریافت داده رخ داده است.";

export default QueryClientProvider;
