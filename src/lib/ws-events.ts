export type WsType = 'queued' | 'running' | 'progress' | 'judge' | 'fail' | 'complete';

export interface QueuedEvent {
  jobId: string;
  providerId?: string;
  variantId?: string;
}

export interface RunningEvent {
  jobId: string;
  providerId: string;
  variantId: string;
}

export interface ProgressEvent {
  jobId: string;
  providerId: string;
  variantId: string;
  progress: number;
  message?: string;
}

export interface JudgeEvent {
  jobId: string;
  progressionId: string;
  judgment: 'pass' | 'fail';
  notes: string[];
  tags: string[];
}

export interface FailEvent {
  jobId: string;
  providerId?: string;
  variantId?: string;
  error: string;
}

export interface CompleteEvent {
  jobId: string;
  successCount: number;
  failureCount: number;
}

export type WsEventMap = {
  queued: QueuedEvent;
  running: RunningEvent;
  progress: ProgressEvent;
  judge: JudgeEvent;
  fail: FailEvent;
  complete: CompleteEvent;
};

export interface WsEnvelope<TType extends WsType = WsType, TData = WsEventMap[TType]> {
  sessionId: string;
  type: TType;
  ts: number;
  data: TData;
}

// TODO(Jules): extend payloads with traceId/job metrics for observability dashboards.
