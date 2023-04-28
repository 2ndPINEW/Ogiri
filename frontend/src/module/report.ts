import { API_BASE } from "@/constants";

export interface ResponseData {
  id: string;
  created_at: string;
  odai: string;
  ended_at: string;
  answers: Answer[];
  groups: Group;
}

interface Answer {
  id: string;
  created_at: string;
  answer: string;
  score: number;
  evaluation: string;
  status: string;
  users: User;
}

interface User {
  id: string;
  name: string;
  icon_url: string;
}

interface Group {
  id: string;
  name: string;
  icon_url: string;
}

export const retrieveReportData = async (
  groupId: string,
  ogiriId: string
): Promise<ResponseData> => {
  const url = `${API_BASE}groups/${groupId}/ogiris/${ogiriId}/report`;
  const response = await fetch(url);
  return await response.json();
};
