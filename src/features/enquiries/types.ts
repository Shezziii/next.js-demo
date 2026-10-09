import type { ID, ISODateString } from "@/types/common";

import type { EnquiryTopic } from "./schemas";

export type Enquiry = {
  id: ID;
  kind: "contact" | "registration";
  name: string;
  email: string;
  phone: string;
  topic?: EnquiryTopic;
  planId?: string;
  message?: string;
  createdAt: ISODateString;
};
