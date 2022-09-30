/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/*
el 显示的容器
new createTree(el,style)
构建结构树
init(data)
放大true 缩小false num放大或者缩小的级别 0.1-2
enlarge(boolean,num)
展开true 收起false
openAway(boolean)
*/
import { render, createVNode } from 'vue';
import store from '@/project/command@3.0/store';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
const vm = createVNode(
    ContactMoreButton,
);

let treeBtn = ''; // 收起和展开按钮的最初样式
let collect = ''; // 收起按钮
let discharge = ''; // 展开按钮
class createTree {
    constructor(el, mdSt) {
        treeBtn = mdSt['reserveStructure_tree-btn']; // 收起和展开按钮的最初样式
        collect = mdSt.reserveStructure_collect; // 收起按钮
        discharge = mdSt.reserveStructure_discharge; // 展开按钮
        this.el = document.getElementById(el);
        if (this.el) {
            this.el.innerHTML = '';
        }
        console.log('当前树', this.el);
        // 从1-5阶层每层的样式
        this.classArr = [mdSt['reserveStructure_o-st'], mdSt['reserveStructure_t-st'], mdSt['reserveStructure_tr-st'], mdSt['reserveStructure_f-st'], mdSt['reserveStructure_fi-st']];
        this.bigWrap = mdSt.reserveStructure_wrap; // el下的第一个容器
        this.wrapDiv = mdSt['reserveStructure_wrap-div']; // 放置那颗树下的其他节点
        this.initTree = mdSt['reserveStructure_init-tree']; // 名字默认样式
        this.treeWrap = mdSt['reserveStructure_tree-wrap']; // 每颗树节点的外套
        this.arrowClassName = mdSt.reserveStructure_arrow; // 默认右边剪头的class
        this.horizonDetail = mdSt.reserveStructure_horizon_detail; // 横树细节按钮
        this.verticalDetail = mdSt.reserveStructure_vertical_detail; // 竖树细节按钮
        this.reserveStructure_havechild = mdSt['reserveStructure_havechild']; // 有孩子的第一层
        this.leftArrow = mdSt['reserveStructure_left-arrow']; // 左边箭头的class
        this.straightLine = mdSt['reserveStructure_straight-line']; // 直线
        this.horizontalLine = mdSt['reserveStructure_horizontal-line']; // 横线
        this.horizontalLineLeft = mdSt['reserveStructure_horizontal-direction-left']; // 左边方向
        this.horizontalLineRight = mdSt['reserveStructure_horizontal-direction-right']; // 右边方向
        // 横向显示
        this.transverse_tree = mdSt.transverse_tree;
        /* 盒子 */
        this.transverse_tree_wrap = mdSt.transverse_tree_wrap;
        this.childBox = mdSt.childBox;
        /* 内容 */
        this.transverse_tree_content = mdSt.transverse_tree_content;
        this.transverse_tree_first_content = mdSt.transverse_tree_first_content;
        this.transverse_tree_three_content = mdSt.transverse_tree_three_content;
        /* 竖线 */
        this.transverse_tree_verticalLine = mdSt.transverse_tree_verticalLine;
        this.transverse_tree_verticalLine_top = mdSt.transverse_tree_verticalLine_top;
        /* 箭头 */
        this.transverse_tree_arrow = mdSt.transverse_tree_arrow;
        this.transverse_tree_arrow_flip = mdSt.transverse_tree_arrow_flip;
        /* 分支线 */
        this.transverse_tree_branch = mdSt.transverse_tree_branch;
        /* 按钮 */
        this.transverse_tree_btn = mdSt.transverse_tree_btn;
        this.transverse_tree_btn_collect = mdSt.transverse_tree_btn_collect;
        this.transverse_tree_btn_discharge = mdSt.transverse_tree_btn_discharge;
        // 移动盒子
        this.move_el = mdSt['move-el'];
        this.move_box = mdSt['move-box'];
        this.moveViewBox = mdSt.moveViewBox;
        this.treeBtn = treeBtn; // 收起和展开按钮的最初样式
        this.collect = collect; // 收起按钮
        this.discharge = discharge; // 展开按钮
        this.mousedownObj = {}; // 记录鼠标按下位置
        this.mouseMoveFlag = false; // 鼠标移动时的锁
        // 操作的div
        this.handleDiv = '';
        // 按钮的初始状态
        this.btnState = true;
        // this.setMargin = 1000; // 移动边界
        // 人名前面的椭圆
        this.ellipseChief = mdSt.ellipseChief;
        this.ellipseSecond = mdSt.ellipseSecond;
        this.ellipseRespond = mdSt.ellipseRespond;
        this.ellipseContact = mdSt.ellipseContact;
        this.leadUnit = mdSt.leadUnit;
    }

    // 初始化
    init(data) {
        const wrapDiv = document.createElement('div');
        wrapDiv.className = this.bigWrap;
        // 生成树结构
        this.creatEl(data, 0, wrapDiv);
        // this.creatTransverse(data, 0, wrapDiv);
        this.el.appendChild(wrapDiv);
        // 滚动到最中间
        wrapDiv.scrollLeft = wrapDiv / 2;
        // 添加事件
        this.addevent(wrapDiv);
        // 根据显示视口的宽高设置树形的zoom
        this.setTreeViewsZoom(wrapDiv);
        // 操作的盒子
        this.handleDiv = wrapDiv.children[0];
    }

    // 给根节点下的盒子绑定拖拽和缩放事件
    addevent(el) {
        const that = this;
        const nodeEl = el.children[0];
        el.addEventListener('mousewheel', (e) => {
            // 判断滚动方向
            const wheelVal = e.wheelDelta;
            // 缩放比例
            if (wheelVal > 0) {
                that.enlarge(true, '', nodeEl);
            } else {
                that.enlarge(false, '', nodeEl);
            }
        }, false);
        // 鼠标按下
        el.addEventListener('mousedown', (e) => {
            that.mousedownObj = {
                x: e.x,
                y: e.y,
            };
            that.mouseMoveFlag = true;
        }, false);
        // 鼠标抬起
        el.addEventListener('mouseup', (e) => {
            that.mouseMoveFlag = false;
        }, false);
        el.addEventListener('mousemove', (e) => {
            if (that.mouseMoveFlag) {
                that.dragEvent(e, nodeEl);
            }
        }, false);
        window.addEventListener('mouseup', (e) => {
            that.mouseMoveFlag = false;
        }, false);
    }

    // 拖拽 事件
    dragEvent(e, nodeEl) {
        // const zoom = parseFloat(nodeEl.style.zoom) || 1;
        // const zoomVal = Number(zoom.toFixed(1));
        // console.log(zoomVal);
        const goBeyond = this.setMargin;
        const oldLeft = parseInt(nodeEl.style.left, 10);
        const oldTop = parseInt(nodeEl.style.top, 10);
        const oldLeftVal = oldLeft || 0;
        const oldTopVal = oldTop || 0;
        const left = oldLeftVal + (e.x - this.mousedownObj.x);
        const top = oldTopVal + (e.y - this.mousedownObj.y);
        const leftVal = left;
        const topVal = top;
        // if (Math.abs(left) > this.setMargin) {
        //   leftVal = left > 0 ? goBeyond : -1 * goBeyond;
        // }
        // if (Math.abs(top) > this.setMargin) {
        //   topVal = top > 0 ? goBeyond : -1 * goBeyond;
        // }
        nodeEl.style.left = `${leftVal}px`;
        nodeEl.style.top = `${topVal}px`;
        this.mousedownObj = {
            x: e.x,
            y: e.y,
        };
    }

    // 生成竖直树元素
    creatEl(data, index, el) {
        const leg = data.length;
        console.log(data);
        data.forEach((ele, ind) => {
            ele.flag = index + 10;
            // 盒子
            const div = document.createElement('div');
            div.className = this.treeWrap;
            // 指向盒子的箭头
            const arrow = document.createElement('div');
            // 盒子里面的内容
            const textdiv = document.createElement('div');
            textdiv.onclick = function(e) {
                store.commit('reservePlan/setCurrNode', ele);
				e.stopPropagation();
            };
            if (ele?.leadUnit === 1) {
                const leadUnit = document.createElement('span');
                const textName = document.createElement('span');
                leadUnit.innerText = '牵头单位';
                textName.innerText = ele.name;
                leadUnit.className = this.leadUnit;
                textdiv.appendChild(leadUnit);
                textdiv.appendChild(textName);

            } else {
                textdiv.innerText = ele.name;
            }
            let ellipse = document.createElement('span');
            let textdivText = document.createElement('span');
            if (ele?.label === "应急负责人") {
                textdiv.innerText = '';
                ellipse.innerText = '负责人';
                textdivText.innerText = `${ele.name}/${ele.position}`;
                ellipse.className = this.ellipseRespond;
                textdiv.appendChild(ellipse);
                textdiv.appendChild(textdivText);
                if (ele.position) {
                    // 附加按钮
                    // const container = document.createElement('span');
                    // container.className = this.verticalDetail;
                    // render(vm, container);
                    // textdiv.appendChild(container);
                }
            } else if (ele?.label === "应急联络人") {
                textdiv.innerText = '';
                ellipse.innerText = '联络人';
                textdivText.innerText = `${ele.name}/${ele.position}`;
                ellipse.className = this.ellipseRespond;
                textdiv.appendChild(ellipse);
                textdiv.appendChild(textdivText);
                if (ele.position) {
                    // 附加按钮
                    // const container = document.createElement('span');
                    // container.className = this.verticalDetail;
                    // render(vm, container);
                    // textdiv.appendChild(container);
                }
            }
            // 是第一次时生成一个给横向显示组织架构的容器
            if (index === 0) {
                const transverseWrap = document.createElement('div');
                textdiv.appendChild(transverseWrap);
                this.creatTransverse(data, 0, transverseWrap);
            }
            let className = '';
            // 第一层,并且有孩子
            if (index === 1 && ele.children && Array.isArray(ele.children) && ele.children.length > 0) {
                className = this.reserveStructure_havechild;
            } else className = this.classArr[index > 4 ? 4 : index];
            // 不是第一个节点时
            if (index !== 0) {
                arrow.className = `${this.arrowClassName} ${this.leftArrow}`;
                textdiv.className = `${this.initTree} ${className}`;
                div.appendChild(arrow);
            } else {
                textdiv.className = className;
            }
            // 盒子里面的盒子
            const wrapDiv = document.createElement('div');
            wrapDiv.className = this.wrapDiv;
            div.appendChild(textdiv);
            // 添加横线
            const horizontalLine = document.createElement('div');
            // 计算线方向
            this.directionLine(data, horizontalLine, div);
            // 最后一个或者第一个都不等于100%
            if (leg - 1 !== ind && ind !== 0) {
                horizontalLine.style.width = '100%';
            }
            // 第一个节点不加载横线
            if (index !== 0) {
                div.appendChild(horizontalLine);
            }
            // 查看节点下方是否还有节点存在
            if (ele.children && Array.isArray(ele.children) && ele.children.length !== 0) {
                // 添加分支线
                const divs = document.createElement('div');
                if (index === 0) {
                    divs.className = `${this.straightLine} ${this.straightLine}1`;
                } else {
                    divs.className = this.straightLine;
                }
                div.appendChild(divs);
                // 添加收起按钮
                const btn = document.createElement('div');
                btn.className = `${this.treeBtn} ${this.collect}`;
                // 添加收起和展开事件
                btn.onclick = this.foldAndUnfold;
                wrapDiv.appendChild(btn);
                div.appendChild(wrapDiv);
                // 还有子节点就继续创建
                this.creatEl(ele.children, (index + 1), wrapDiv);
            } else {
                div.appendChild(wrapDiv);
            }
            el.appendChild(div);
            // 计算箭头方向和赋于最外面容器宽度
            this.direction(wrapDiv, arrow, div, index);
        });
    }

    // 生成横向树结构
    creatTransverse(data, ind, el) {
        console.log(data);
        const that = this;
        data.forEach((ele, i) => {
            ele.flag = ind;
            // 第一层渲染的时候 leftChildren 没有数据就直接结束
            if (ind === 0) {
                if (!ele.leftChildren || ele.leftChildren.length === 0) {
                    return;
                }
            }
            // 盒子
            const box = document.createElement('div');
            box.className = this.transverse_tree_wrap;
            // 用于存放内容和分支、按钮的盒子
            const content = document.createElement('div');
			box.attri_data = ele;
            box.onclick = function(e) {
                store.commit('reservePlan/setCurrNode', this.attri_data);
				e.stopPropagation();
            };
            if (ind !== 0) {
                const ellipse = document.createElement('span');
                const span = document.createElement('span');
                ellipse.innerText = `${ele.labelName}`;
                ellipse.className = ellipse.innerText === '总指挥' ? this.ellipseChief : this.ellipseSecond;
                span.innerText = `${ele.name}(${ele.innerPosition}/${ele.position})`;
                content.appendChild(ellipse);
                content.appendChild(span);
                if (ind === 1) {
                    content.className = this.transverse_tree_content;
                    // 附加按钮
                    // const container = document.createElement('span');
                    // container.className = this.horizonDetail;
                    // render(vm, container);
                    // content.appendChild(container);
                } else {
                    content.className = this.transverse_tree_three_content;
                }
            } else {
                content.className = this.transverse_tree_first_content;
            }
            box.appendChild(content);
            // 存放children的盒子
            const childBox = document.createElement('div');
            childBox.className = this.childBox;
            box.appendChild(childBox);
            const arrow = document.createElement('div');
            const verticalLine = document.createElement('div');
            // 箭头
            if (ind !== 0) {
                arrow.className = this.transverse_tree_arrow;
                box.appendChild(arrow);
                // 竖线
                verticalLine.className = this.transverse_tree_verticalLine;
                if (data.length > 2 && i !== 0 && i !== data.length - 1) {
                    verticalLine.style.height = '100%';
                }
                box.appendChild(verticalLine);
            }
            // 定义如何读取数据
            if (
                (ele.children && Array.isArray(ele.children) && ele.children.length !== 0) ||
                (ele.leftChildren && Array.isArray(ele.leftChildren) && ele.leftChildren.length !== 0)
            ) {
                // 分支
                const branch = document.createElement('div');
                branch.className = this.transverse_tree_branch;
                content.appendChild(branch);
                // 按钮
                const btn = document.createElement('div');
                btn.className = `${this.transverse_tree_btn} ${this.transverse_tree_btn_collect}`;
                btn.onclick = function(e) {
                    const btnHandleEl = this.parentElement.nextElementSibling;
                    if (btnHandleEl.style.display === 'none') {
                        btnHandleEl.style.display = 'block';
                        this.className = `${that.transverse_tree_btn} ${that.transverse_tree_btn_collect}`;
                    } else {
                        btnHandleEl.style.display = 'none';
                        this.className = `${that.transverse_tree_btn} ${that.transverse_tree_btn_discharge}`;
                    }
                };
                content.appendChild(btn);
                if (ind === 0) {
                    this.creatTransverse(ele.leftChildren, ind + 1, childBox);
                } else {
                    this.creatTransverse(ele.children, ind + 1, childBox);
                }
            } else if (data.length === 1) {
                // 没有兄弟节点，并且没有子节点
                verticalLine.className = '';
            }
            setTimeout(() => {
                const elCententPos = el.offsetHeight / 2;
                const boxPosition = box.offsetTop + box.offsetHeight / 2;
                if (boxPosition > elCententPos) {
                    arrow.className = `${this.transverse_tree_arrow} ${this.transverse_tree_arrow_flip}`;
                    verticalLine.className = `${this.transverse_tree_verticalLine} ${this.transverse_tree_verticalLine_top}`;
                }
            }, 800);
            if (ind === 0) {
                el.className = this.transverse_tree;
                setTimeout(() => {
                    const parentEl = el.parentElement;
                    const parentElWrap = parentEl.parentElement;
                    const w = parentEl.offsetWidth;
                    const wd = ((parentElWrap.offsetWidth - parentEl.offsetWidth - w + 70) / 2);
                    console.log(parentElWrap.offsetWidth , w,wd)
                    parentElWrap.style.left = `${wd}px`;
                    el.style.left = `${w - 55}px`;
                    el.style.height = `${box.offsetHeight}px`;
                    // 把横树形的一半高度添加给上层的大盒子
                    el.parentElement.parentElement.style.paddingTop = `${box.offsetHeight / 2}px`;
                    // 设置竖线高度
                    if (that.straightLine && document.querySelector(`.${that.straightLine}1`)) {
                        document.querySelector(`.${that.straightLine}1`).style.height = `${box.offsetHeight / 2}px`;
                    }
                }, 800);
            }
            if (ind >= 1) {
            }
            el.appendChild(box);
        });
    }

    // 收起和展开事件绑定
    foldAndUnfold() {
        const allBrotherEl = this.parentElement.children;
        if (this.className.indexOf(collect) !== -1) {
            this.className = `${treeBtn} ${discharge}`;
            allBrotherEl.forEach((ele) => {
                if (ele.className.indexOf(treeBtn) === -1) {
                    // ele.style.opacity = 0;
                    ele.style.display = 'none';
                }
            });
        } else {
            this.className = `${treeBtn} ${collect}`;
            allBrotherEl.forEach((ele) => {
                if (ele.className.indexOf(treeBtn) === -1) {
                    // ele.style.opacity = 1;
                    ele.style.display = 'flex';
                }
            });
        }
    }

    // 计算箭头方向和赋于最外面容器宽度
    direction(wrapDiv, arrow, div, index) {
        /*
            wrapDiv 用来放置子节点的盒子
            arrow   箭头
            div     id元素下的第一个根盒子
            index   下标
        */
        setTimeout(() => {
            const parentEl = div.parentElement;
            const divPos = div.offsetLeft + div.offsetWidth / 2;
            const core = parentEl.offsetWidth / 2;
            if (divPos > core) {
                arrow.className = this.arrowClassName;
            }
            if (index === 0) {
                // 给最外面的大容器设置宽度
                div.style.width = `${wrapDiv.offsetWidth}px`;
                // 移动上限 暂时不做
                // this.setMargin = wrapDiv.offsetWidth - div.parentElement.offsetWidth;
                div.style.transition = 'none';
                console.log(div, wrapDiv);
                console.log(div.style.width, wrapDiv.offsetWidth);
            }
        }, 1000);
    }

    // 计算线方向
    directionLine(data, line, div) {
        /*
            wrapDiv 用来放置子节点的盒子
            arrow   箭头
            div     id元素下的第一个根盒子
            index   下标
        */
        setTimeout(() => {
            const parentEl = div.parentElement;
            const divPos = div.offsetLeft + div.offsetWidth / 2;
            const core = parentEl.offsetWidth / 2;
            if (divPos > core) {
                line.className = `${this.horizontalLine} ${this.horizontalLineLeft}`;
            } else if (data.length > 1) {
                // 没有子节点 或者 不是第二层
                line.className = `${this.horizontalLine} ${this.horizontalLineRight}`;
            }
        }, 1000);
    }

    // 生成视口盒子
    createMoveViewBox(el) {
        // 暂时不做
        /*
          <div class="moveViewBox" >
              <div>
                  <div class="move-box"></div>
                  <div class="move-el"></div>
              </div>
          </div>
        */
        const move_wrap_box = document.createElement('div');
        const move_wrap_box_bgr = document.createElement('div');
        const move_wrap_box_moveRedBox = document.createElement('div');
        const move_wrap_box_moveEl = document.createElement('div');
        move_wrap_box_bgr.appendChild(move_wrap_box_moveEl);
        move_wrap_box_bgr.appendChild(move_wrap_box_moveRedBox);
        move_wrap_box.appendChild(move_wrap_box_bgr);
        move_wrap_box.className = this.moveViewBox;
        move_wrap_box_moveRedBox.className = this.move_box;
        move_wrap_box_moveEl.className = this.move_el;
        el.appendChild(move_wrap_box);
        // setTimeout(() => {
        const cloneEl = move_wrap_box.previousElementSibling.cloneNode(true);
        console.log(cloneEl);
        move_wrap_box_moveEl.appendChild(cloneEl);
        // }, 20);
    }

    // 根据显示视口的宽高设置树形的zoom
    setTreeViewsZoom(el) {
        setTimeout(() => {
            const treeEl = el.children[0];
            const h = el.offsetHeight / treeEl.offsetHeight;
            const w = el.offsetWidth / treeEl.offsetWidth;
            const n = h > w ? w : h;
            const s = Math.round((n * 10)) / 10; // 缩放比例
            treeEl.style.zoom = s;
        });
    }

    // 放大缩小
    enlarge(flag, num, node) {
        // 缩放比例
        const nodeEl = node || this.handleDiv;
        if (num) {
            nodeEl.style.zoom = num;
        } else {
            const zommVal = nodeEl.style.zoom !== '' ? Number(nodeEl.style.zoom) : 1;
            if (flag) {
                nodeEl.style.zoom = (zommVal + 0.1) > 2 ? zommVal : (zommVal + 0.1);
            } else {
                nodeEl.style.zoom = (zommVal - 0.1) <= 0 ? zommVal : (zommVal - 0.1);
            }
        }
    }

    // 展开 收起
    openAway(falg = true) {
        const sBtn = Array.from(document.querySelectorAll(`.${this.treeBtn}`));
        const hBtn = Array.from(document.querySelectorAll(`.${this.transverse_tree_btn}`));
        // console.log('进来了');
        if (this.btnState === falg) {
            return;
        }
        this.btnState = falg;
        sBtn.forEach((ele) => {
            ele.click();
        });
        hBtn.forEach((ele) => {
            ele.click();
        });
        // console.log('点击了');
    }
}

export default createTree;
