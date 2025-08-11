export type HandleErrorsResult<ResultData = unknown> =
  | {
      isSuccess: true;
      data: ResultData;
    }
  | {
      isSuccess: false;
      isUnknownError: boolean;
      error: Record<string, string[] | undefined>;
    };
