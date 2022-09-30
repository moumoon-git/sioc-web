<template>
  <span>{{ displayedAmount }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Data {
  timestamp: number;
  startTimestamp: number;
  currentStartAmount: number;
  currentAmount: number;
  currentDuration: number;
  paused: boolean;
  remaining: number;
  animationFrame: number;
}

export default defineComponent({
  name: 'Vue3Autocounter',
  interval: null,
  props: {
    startAmount: {
      type: Number,
      default: 0,
    },
    endAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    duration: {
      type: Number,
      default: 3,
      validator(duration: number): boolean {
        return duration >= 1;
      },
    },
    autoinit: {
      type: Boolean,
      default: true,
    },
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    separator: {
      type: String,
      default: ',',
    },
    decimalSeparator: {
      type: String,
      default: '.',
    },
    decimals: {
      type: Number,
      default: 0,
      validator(decimals: number): boolean {
        return decimals >= 0;
      },
    },
  },
  data(): Data {
    return {
      timestamp: 0,
      startTimestamp: 0,
      currentAmount: 0,
      currentStartAmount: 0,
      currentDuration: 0,
      paused: false,
      remaining: 0,
      animationFrame: 0,
    };
  },
  mounted(): void {
    this.currentAmount = (this as any).startAmount;
    this.currentStartAmount = (this as any).startAmount;
    this.currentDuration = (this as any).duration * 1000;
    this.remaining = (this as any).duration * 1000;
    if ((this as any).autoinit) this.start();
    else this.paused = true;
    this.$emit('mounted');
  },
  unmounted(): void {
    this.cancelAnimation();
  },
  watch: {
    startAmount(): void {
      this.reset();
    },
    endAmount(): void {
      this.reset();
    },
    duration(): void {
      this.reset();
    },
  },
  computed: {
    isCountingUp(): boolean {
      return (this as any).endAmount > (this as any).startAmount;
    },
    displayedAmount(): string {
      return `${(this as any).prefix}${this.formatedAmount}${(this as any).suffix}`;
    },
    formatedAmount(): string {
      const regex = /(\d+)(\d{3})/;

      let numberString: string = this.currentAmount.toFixed((this as any).decimals);
      numberString += '';
      let numberArray: Array<string> = numberString.split('.');
      let numbers: string = numberArray[0];
      let decimals: string =
        numberArray.length > 1 ? (this as any).decimalSeparator + numberArray[1] : '';
      let isNumber = !isNaN(parseFloat((this as any).separator));

      if ((this as any).separator && !isNumber) {
        while (regex.test(numbers))
          numbers = numbers.replace(regex, '$1' + (this as any).separator + '$2');
      }

      return numbers + decimals;
    },
  },
  methods: {
    start(): void {
      this.cancelAnimation();
      this.currentStartAmount = (this as any).startAmount;
      (this as any).startTimestamp = null;
      this.currentDuration = (this as any).duration * 1000;
      this.paused = false;
      this.animationFrame = window.requestAnimationFrame(this.counting);
    },
    pause(): void {
      if (this.paused) return;
      this.cancelAnimation();
      this.paused = true;
    },
    resume(): void {
      if (!this.paused) return;
      (this as any).startTimestamp = null;
      this.currentDuration = +this.remaining;
      this.currentStartAmount = +this.currentAmount;
      this.animationFrame = window.requestAnimationFrame(this.counting);
      this.paused = false;
    },
    reset(): void {
      this.paused = false;
      (this as any).startTimestamp = null;
      this.cancelAnimation();
      this.currentAmount = (this as any).startAmount;
      if ((this as any).autoinit) this.start();
      else this.paused = true;
    },
    counting(timestamp: number): void {
      this.timestamp = timestamp;
      if (!this.startTimestamp) this.startTimestamp = timestamp;
      let progress: number = timestamp - this.startTimestamp;
      this.remaining = this.currentDuration - progress;

      if (!this.isCountingUp) {
        this.currentAmount =
          this.currentStartAmount -
          (this.currentStartAmount - (this as any).endAmount) * (progress / this.currentDuration);
        this.currentAmount =
          this.currentAmount < (this as any).endAmount
            ? (this as any).endAmount
            : this.currentAmount;
      } else {
        this.currentAmount =
          this.currentStartAmount +
          ((this as any).endAmount - this.currentStartAmount) * (progress / this.currentDuration);
        this.currentAmount =
          this.currentAmount > (this as any).endAmount
            ? (this as any).endAmount
            : this.currentAmount;
      }

      if (progress < this.currentDuration)
        this.animationFrame = window.requestAnimationFrame(this.counting);
      else this.$emit('finished');
    },
    cancelAnimation(): void {
      if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame);
    },
  },
});
</script>
