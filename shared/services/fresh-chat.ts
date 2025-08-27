"use client"
import { useEffect, useRef } from 'react';
import { environment } from '@/environments/environment';
import { commonMessages } from '../constants/commonMessages';



interface FCWidget {
  init: (data: any) => void;
  user: {
    update: (user: any) => void;
    get: (cb: (res: any) => void) => void;
    setProperties: (user: any, cb: (res: any) => void) => void;
    clear: (cb: (res: any) => void) => void;
  };
  isOpen: () => boolean;
  open: (payload?: any) => void;
  close: () => void;
  track: (event: string) => void;
  setTags: (tags: string[]) => void;
  setLocale: (locale: string) => void;
  destroy: () => void;
  isInitialized: () => boolean;
  on: (event: string, cb: (res: any) => void) => void;
  setExternalId?: (id: string) => void;
}

declare global {
  interface Window {
    fcWidget: FCWidget;
  }
}

export function useFreshChat(authUser: any, userDetails: any) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!scriptLoaded.current) {
      const src = `${environment.FRESHCHAT_URL}/js/widget.js?t=${Date.now()}`;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        initWidget();
      };
      document.body.appendChild(script);
    } else {
      initWidget();
    }
    // Cleanup
    return () => {
      window.fcWidget?.destroy();
    };
    // eslint-disable-next-line
  }, []);

  function initWidget() {
    const data: any = {
      token: environment.FRESHCHAT_TOKEN,
      host: environment.FRESHCHAT_URL,
      locale:
        typeof window !== 'undefined' ? localStorage.getItem('lang') : 'en',
      config: {
        headerProperty: {
          backgroundColor: '#ff8e6e',
          foregroundColor: '#ffff',
        },
        content: {
          headers: {
            csat_question: commonMessages.FRESHCHAT_CSAT_QUESTION,
          },
        },
      },
    };
    if (userDetails?.email) {
      data.externalId = userDetails.email;
    }
    window.fcWidget?.init(data);
    assignAndSetProperties(userDetails);
  }

  function assignAndSetProperties(
    data: any,
    orderNumber?: string,
    agentId?: string
  ) {
    if (!data) return;
    let name = `${data.first_name} ${data.last_name}`.trim();
    if (orderNumber) name += `[${orderNumber}]`;
    if (data.vendor?.business_name) name += `[${data.vendor.business_name}]`;
    const user = {
      email: data.email,
      phone: data.phone,
      firstName: name,
      assignedAgentEmail: agentId,
      branch_id: data.vendor?.branch_id || '',
      vendor_id: data.vendor?.vendor_id || '',
    };
    window.fcWidget?.user.setProperties(user, () => {});
  }

  function open(payload?: {
    name?: string;
    channelId?: string;
    replyText?: string;
  }) {
    window.fcWidget?.open(payload);
  }

  function destroy() {
    window.fcWidget?.destroy();
  }

  function setTags(tags: string[]) {
    window.fcWidget?.setTags(tags);
  }

  function logout() {
    window.fcWidget?.user.clear(() => {});
  }

  return {
    open,
    destroy,
    setTags,
    logout,
    assignAndSetProperties,
    widget: window.fcWidget,
  };
}
