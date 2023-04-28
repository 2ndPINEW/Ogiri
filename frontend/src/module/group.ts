import { API_BASE } from "@/constants";

export interface Group {
  id: string;
  name: string;
  icon_url: string;
  created_at: string;
}

export interface Ogiri {
  id: string;
  created_at: string;
  odai: string;
  ended_at: string;
}

export const retrieveGroupData = async (groupId: string): Promise<Group> => {
  const url = `${API_BASE}groups/${groupId}`;
  const response = await fetch(url);
  return await response.json();
};

export const retrieveOgirisData = async (groupId: string): Promise<Ogiri[]> => {
  const url = `${API_BASE}groups/${groupId}/ogiris`;
  const response = await fetch(url);
  return await response.json();
};
