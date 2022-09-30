import { ref } from 'vue';

export default () => {
  const imgURL = ref('');

  const captureMapShoot = () => new Promise<string>((resolve) => {
    const { map } = window;
    imgURL.value = '';
    if (map) {
      map.mapScreenshot((res: string) => {
        imgURL.value = res;
        resolve(res);
      });
    }
  });

  const downloadMapShoot = () => {
    const imgName = `出图（${(new Date()).toLocaleDateString()} ${(new Date()).toLocaleTimeString()}）.png`;
    const a = document.createElement('a');
    a.href = imgURL.value;
    a.download = imgName;
    a.target = '_blank';
    a.click();
    imgURL.value = '';
  };

  return {
    captureMapShoot,
    downloadMapShoot,
    imgURL,
  };
};
