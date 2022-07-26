import { request } from '@/common/utils';

export interface GetGameDataParam {
  type: number;
}
/**
 * 获取hao123的Game数据
 * @param params GetGameDataParam
 */
export const getGameDataApi = async (params: GetGameDataParam) => {
  return request.get('hao::api/getgamedata', { params });
};
