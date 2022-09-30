import { useStore } from 'vuex';

export default () => {
  const store = useStore();
  const getLngLat = () => {
    const { map } = window;
    if (store.state.event?.longitude && store.state.event?.latitude) {
      map.getMapMaxZoom().then((max: number) => {
        map.setCentent(
          {
            longitude: store.state.event.longitude,
            latitude: store.state.event.latitude,
          },
          max,
        );
      });
    }
  };
  return {
    getLngLat,
  };
};
