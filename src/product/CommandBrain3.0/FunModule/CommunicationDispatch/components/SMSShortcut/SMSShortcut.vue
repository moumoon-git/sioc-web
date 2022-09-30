<script lang="tsx">
import {
  defineComponent,
  PropType,
  ref,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import createBEM from './createBEM';
import './SMSShortcut.scss';

export default defineComponent({
  name: 'SMSShortcut',
  props: {
    destroy: {
      type: Function as PropType<() => void>,
      default: () => {
        console.warn('missing prop: destroy');
      },
    },
    eventID: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const bem = createBEM('sms-shortcut-dialog');

    // textarea content
    const text = ref('');

    /**
     * send message
     */
    const sendMessage = () => {
      const request = {
        method: 'POST',
        service: 'eoc',
        url: '/eos/communication/sms/addSmsQueue',
        headers: { 'Content-Type': 'application/json' },
        data: {
          smstypeId: '',
          caseId: 0,
          content: text.value,
          phoneNum: String(props.phone),
          contactorIds: String(props.id),
          eventId: props.eventID,
        },
      } as const;
      $http(request).then((response) => {
        if (response.errorcode === 0) {
          $message.success('发送短信成功');
          props.destroy();
        } else {
          $message.error(`发送短信失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        $message.error(`发送短信失败，错误信息：${error}`);
      });
    };

    // history record list
    const historyList = ref<any[]>([]);
    const sentCount = ref(0);

    /**
     * get history record of this contact
     */
    const getHistory = () => {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/listByPhone',
        params: {
          phone: props.phone,
          eventId: props.eventID,
        },
      } as const;
      $http(request).then((response) => {
        if (response.errorcode === 0 && response?.data) {
          historyList.value = response.data.smsList || [];
          sentCount.value = response.data.countSend || 0;
        } else {
          $message.error(`获取短信记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        $message.error(`获取短信记录失败，错误信息：${error}`);
      });
    };

    getHistory();

    // is history record page shown
    const isHistory = ref(false);

    // render function
    return () => (
      <div class={bem()}>
        <header class={bem('header')}>
          <h1>短信内容</h1>
          <button onClick={props.destroy as any} />
        </header>
        <main class={bem('main')}>
          {
            isHistory.value
              ? (<>
                <h2>
                  <span>短信记录</span>
                  <span>全部：{historyList.value.length}</span>
                  <span>发送：<span style="color:#0BD295">{sentCount.value}</span></span>
                  <span>回复：<span style="color:#0091FF">{historyList.value.length - sentCount.value}</span></span>
                </h2>
                <ul>
                  {historyList.value.map((record: any) => (
                    <li>
                      <h3>
                        <span class={record.direct === 0 ? bem(['main', 'dot'], 'green') : bem(['main', 'dot'], 'blue')}></span>
                        {record.sendTime}
                      </h3>
                      <p>{record.content}</p>
                    </li>
                  ))}
                </ul>
              </>)
              : (<>
                <textarea
                  v-model={text.value}
                  maxlength={500}
                  placeholder="请输入短信内容"
                />
                <div class={bem(['main', 'hint'])}>{text.value.length}/500</div>
              </>)
          }
        </main>
        <footer class={bem('footer')}>
          {
            isHistory.value
              ? (<>
                <button onClick={() => { props.destroy(); }}>取消</button>
                <button onClick={() => { isHistory.value = false; }}>返回</button>
              </>)
              : (<>
                <span onClick={() => { isHistory.value = true; }}>历史记录</span>
                <button onClick={() => { props.destroy(); }}>取消</button>
                <button onClick={() => { sendMessage(); }}>发送</button>
              </>)
          }
        </footer>
      </div>
    );
  },
});
</script>
