import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Success } from './api.interface';

const groupId = 'grandprix';

@Injectable({
  providedIn: 'root',
})
export class OgiriService {
  constructor(private api: ApiService, private userService: UserService) {}

  openOgiris$() {
    return this.api.get<Ogiri[]>(`groups/${groupId}/ogiris/now`);
  }

  answerOgiri$({ ogiriId, answer }: { ogiriId: string; answer: string }) {
    return this.api.post<Success>(
      `groups/${groupId}/ogiris/${ogiriId}/answer`,
      {
        answer,
        userId: this.userService.userId(),
      }
    );
  }

  reportOgiri$({ ogiriId }: { ogiriId: string }) {
    return this.api.get<Report>(`groups/${groupId}/ogiris/${ogiriId}/report`);
  }

  allOgiris$() {
    return this.api.get<Ogiri[]>(`groups/${groupId}/ogiris`);
  }
}

export interface Ogiri {
  id: string;
  created_at: DateString;
  odai: string;
  ended_at: DateString;
}

export interface Report {
  answers: Answer[];
  created_at: DateString;
  ended_at: DateString;
  groups: { id: string; name: string; icon_url: string };
  id: string;
  odai: string;
}

interface Answer {
  id: string;
  created_at: DateString;
  answer: string;
  score: number;
  evaluation: string;
  status: 'complete' | 'waiting';
  users: {
    id: string;
    name: string;
    icon_url: string;
  };
}

type DateString =
  `${string}-${string}-${string}T${string}:${string}:${string}.${string}+${string}:${string}`;
