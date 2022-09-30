type SVMessage = {
  (message: any, duration?: number): HTMLElement,
  info: (message: any, duration?: number) => HTMLElement,
  success: (message: any, duration?: number) => HTMLElement,
  error: (message: any, duration?: number) => HTMLElement,
}

declare const svmessage: SVMessage;

export default svmessage;
