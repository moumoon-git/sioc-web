// 绘制缓冲区
function buffer(map:any): any{
    let handleMap = map || (window as any).map
    handleMap.createdVectorCoverage("testLine").then((x: Object) => {
        let obj = {
            featureadded:function(e:any) {
                console.log(e);
                console.log(e.feature.geometry.components);
                handleMap.getCoverageData("testLine").then((r:object[]) => {
                    let data:any = e.feature.geometry.components;
                    // 绘制缓冲区
                    return handleMap.renderBuffer("testLine",data,20)
                })
            }
        };
        return handleMap
            .newDrawFeature("testLine", "Path", obj, true)
    }).then((res: any) => {
        handleMap.activateDrawFeature("testLine");
    });
}

export default {buffer}