import {
  getOnLineContactorApi,
  getOnLineTeamApi,
  getSubscriptionDevice,
} from '../services/currentOnline';
import OnLineContactorApiDto from '../services/currenOnlineDto';

const useCurrentOnlineList = () => {
  async function getOnLinePersonList(eventId: number): Promise<OnLineContactorApiDto[]> {
    const res = await getOnLineContactorApi(eventId);
    return res;
  }

  async function getOnLineTeamList(eventId: number): Promise<OnLineContactorApiDto[]> {
    const res = await getOnLineTeamApi(eventId);
    return res;
  }

  async function getonlineDeviceList(eventId: number): Promise<OnLineContactorApiDto[]> {
    const res = await getSubscriptionDevice(eventId);
    return res;
  }

  return {
    getOnLinePersonList,
    getOnLineTeamList,
    getonlineDeviceList,
  };
};
export default useCurrentOnlineList;
