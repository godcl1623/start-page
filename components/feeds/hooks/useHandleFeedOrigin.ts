import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import RequestControllers from 'controllers';

interface FeedOriginValidationBody {
  mode: string;
  url: string;
}

const useHandleFeedOrigin = (url: string, mode: string) => {
  const { postDataTo } = new RequestControllers();
  const mutationFn = (body: FeedOriginValidationBody) => postDataTo(url, body);
  const onError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      alert('올바르지 않은 피드 주소입니다.');
    } else if (error instanceof AxiosError && error.response?.status === 502) {
      alert('이미 존재하는 주소입니다.');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
  };
  const { mutateAsync } = useMutation({
    mutationFn,
    onError,
  });

  return async (inputUrl: string | undefined) => {
    if (inputUrl == null) return;
    const body = {
      mode,
      url: inputUrl,
    };
    return await mutateAsync(body);
  };
};

export default useHandleFeedOrigin;
