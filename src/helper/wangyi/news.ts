import { request } from '@/common/utils/request';

export const getSpecialNewsApi = async () => {
  return request({
    url: 'wy::special/new2016_rbeijing_api/',
  });
};
