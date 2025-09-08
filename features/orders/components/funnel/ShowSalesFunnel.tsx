'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { funnelStage } from '@/shared/constants/storageConstants';
import { reportService } from '@/shared/services/report';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShowSalesFunnelProps {
  type: 1 | 2 | 3 | 4;
}

interface FunnelInsight {
  stage: string;
  last_week_count: number;
  prev_stage_last_week_count: number;
  show_count: boolean;
}

export default function ShowSalesFunnel({ type }: ShowSalesFunnelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stage 1 & 2 states
  const [noOrderNoFirstText, setNoOrderNoFirstText] = useState('');
  const [noOrderNoFirstCount, setNoOrderNoFirstCount] = useState(0);
  const [isNoOrderNoFirstText, setIsNoOrderNoFirstText] = useState(false);

  const [noOrderNoRechargeText, setNoOrderNoRechargeText] = useState('');
  const [noOrderNoRechargePercentage, setNoOrderNoRechargePercentage] = useState('0%');
  const [noOrderNoRechargeCount, setNoOrderNoRechargeCount] = useState(0);
  const [isNoOrderNoRechargeText, setIsNoOrderNoRechargeText] = useState(false);

  const [noOrderFollowUp1Text, setNoOrderFollowUp1Text] = useState('');
  const [noOrderFollowUp1Percentage, setNoOrderFollowUp1Percentage] = useState('0%');
  const [noOrderFollowUp1Count, setNoOrderFollowUp1Count] = useState(0);
  const [isNoOrderFollowUp1Text] = useState(false);

  const [noOrderRechargedText, setNoOrderRechargedText] = useState('');
  const [noOrderRechargedPercentage, setNoOrderRechargedPercentage] = useState('0%');
  const [noOrderRechargedCount, setNoOrderRechargedCount] = useState(0);
  const [isNoOrderRechargedText, setIsNoOrderRechargedText] = useState(false);

  const [noOrderFollowUp2Text, setNoOrderFollowUp2Text] = useState('');
  const [noOrderFollowUp2Percentage, setNoOrderFollowUp2Percentage] = useState('0%');
  const [noOrderFollowUp2Count, setNoOrderFollowUp2Count] = useState(0);
  const [isNoOrderFollowUp2Text] = useState(false);

  const [activatedText, setActivatedText] = useState('');
  const [activatedPercentage, setActivatedPercentage] = useState('0%');
  const [activatedCount, setActivatedCount] = useState(0);
  const [isActivatedText, setIsActivatedText] = useState(false);

  // Stage 3 (Retention2)
  const [noOrderHasWalletText, setNoOrderHasWalletText] = useState('');
  const [noOrderHasWalletCount, setNoOrderHasWalletCount] = useState(0);
  const [noOrderHasWalletPercentage, setNoOrderHasWalletPercentage] = useState('0%');

  const [noOrderHasWalletFollowUp1Text, setNoOrderHasWalletFollowUp1Text] = useState('');
  const [noOrderHasWalletFollowUp1Count, setNoOrderHasWalletFollowUp1Count] = useState(0);
  const [noOrderHasWalletFollowUp1Percentage, setNoOrderHasWalletFollowUp1Percentage] = useState('0%');

  const [noOrderHasWalletFollowUp2Text, setNoOrderHasWalletFollowUp2Text] = useState('');
  const [noOrderHasWalletFollowUp2Count, setNoOrderHasWalletFollowUp2Count] = useState(0);
  const [noOrderHasWalletFollowUp2Percentage, setNoOrderHasWalletFollowUp2Percentage] = useState('0%');

  const [noOrderHasWalletRetainedText, setNoOrderHasWalletRetainedText] = useState('');
  const [noOrderHasWalletRetainedCount, setNoOrderHasWalletRetainedCount] = useState(0);
  const [noOrderHasWalletRetainedPercentage, setNoOrderHasWalletRetainedPercentage] = useState('0%');

  // Stage 4 (Reactivation)
  const [firstText, setFirstText] = useState('');
  const [firstCount, setFirstCount] = useState(0);
  const [firstPercentage, setFirstPercentage] = useState('0%');

  const [secondText, setSecondText] = useState('');
  const [secondCount, setSecondCount] = useState(0);
  const [secondPercentage, setSecondPercentage] = useState('0%');

  const [thirdText, setThirdText] = useState('');
  const [thirdCount, setThirdCount] = useState(0);
  const [thirdPercentage, setThirdPercentage] = useState('0%');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetcherMap: Record<number, () => Promise<{ data: FunnelInsight[] }>> = {
      1: reportService.getSalesFunnelActivationInsight,
      2: reportService.getSalesFunnelRetentionInsight,
      3: reportService.getSalesFunnelRetention2Insight,
      4: reportService.getSalesFunnelReactivationInsight,
    };

    const fetcher = fetcherMap[type];

    if (!fetcher) {
      setError(`Unknown funnel type: ${type}`);
      setLoading(false);
      return;
    }

    fetcher()
      .then((response) => {
        const data = response.data;
        if (type === 3) {
          setRetention2Value(data);
        } else if (type === 4) {
          setReActivationValue(data);
        } else {
          setStatus(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch funnel insights');
      })
      .finally(() => setLoading(false));
  }, [type]);

  function setStatus(data: FunnelInsight[]) {
    let baseValue = 0;
    data.forEach((el) => {
      const percentage = el.prev_stage_last_week_count
        ? `${((el.last_week_count / (baseValue || el.prev_stage_last_week_count)) * 100).toFixed(2)}%`
        : '0%';

      if (type === 1) {
        switch (el.stage) {
          case funnelStage.NoOrderNoRecharge:
            setIsNoOrderNoFirstText(true);
            setNoOrderNoFirstText('SIGNED UP');
            setNoOrderNoFirstCount(el.prev_stage_last_week_count);
            setNoOrderNoRechargeText('NO RECHARGE');
            setNoOrderNoRechargePercentage(percentage);
            setNoOrderNoRechargeCount(el.last_week_count);
            setIsNoOrderNoRechargeText(el.show_count);
            baseValue = el.last_week_count;
            break;
          case funnelStage.NoOrderFollowUp1:
            setNoOrderFollowUp1Text('FOLLOW UP1');
            setNoOrderFollowUp1Percentage(percentage);
            setNoOrderFollowUp1Count(el.last_week_count);
            break;
          case funnelStage.NoOrderRecharged:
            setNoOrderRechargedText('RECHARGED');
            setNoOrderRechargedPercentage(percentage);
            setNoOrderRechargedCount(el.last_week_count);
            setIsNoOrderRechargedText(el.show_count);
            break;
          case funnelStage.NoOrderFollowUp2:
            setNoOrderFollowUp2Text('FOLLOW UP2');
            setNoOrderFollowUp2Percentage(percentage);
            setNoOrderFollowUp2Count(el.last_week_count);
            break;
          case funnelStage.Activated:
            setActivatedText('ACTIVATED');
            setActivatedPercentage(percentage);
            setActivatedCount(el.last_week_count);
            setIsActivatedText(el.show_count);
            break;
        }
      } else {
        switch (el.stage) {
          case funnelStage.NoRecharge:
            setIsNoOrderNoFirstText(true);
            setNoOrderNoFirstText('WALLET ALERTED');
            setNoOrderNoFirstCount(el.prev_stage_last_week_count);
            setNoOrderNoRechargeText('NO RECHARGE');
            setNoOrderNoRechargePercentage(percentage);
            setNoOrderNoRechargeCount(el.last_week_count);
            setIsNoOrderNoRechargeText(el.show_count);
            baseValue = el.last_week_count;
            break;
          case funnelStage.FollowUp1:
            setNoOrderFollowUp1Text('FOLLOW UP1');
            setNoOrderFollowUp1Percentage(percentage);
            setNoOrderFollowUp1Count(el.last_week_count);
            break;
          case funnelStage.Recharged:
            setNoOrderRechargedText('RECHARGED');
            setNoOrderRechargedPercentage(percentage);
            setNoOrderRechargedCount(el.last_week_count);
            setIsNoOrderRechargedText(el.show_count);
            break;
          case funnelStage.FollowUp2:
            setNoOrderFollowUp2Text('FOLLOW UP2');
            setNoOrderFollowUp2Percentage(percentage);
            setNoOrderFollowUp2Count(el.last_week_count);
            break;
          case funnelStage.Retained:
            setActivatedText('RETENTION');
            setActivatedPercentage(percentage);
            setActivatedCount(el.last_week_count);
            setIsActivatedText(el.show_count);
            break;
        }
      }
    });
  }

  function setRetention2Value(data: FunnelInsight[]) {
    let baseValue = 0;
    data.forEach((el) => {
      const percentage = el.prev_stage_last_week_count
        ? `${((el.last_week_count / (baseValue || el.prev_stage_last_week_count)) * 100).toFixed(2)}%`
        : '0%';
      if (baseValue === 0) baseValue = el.last_week_count;

      switch (el.stage) {
        case funnelStage.NoOrderHasWallet:
          setNoOrderHasWalletText('POTENTIAL CHURN');
          setNoOrderHasWalletCount(el.last_week_count);
          setNoOrderHasWalletPercentage(percentage);
          break;
        case funnelStage.NoOrderHasWalletFollowUp1:
          setNoOrderHasWalletFollowUp1Text('FOLLOW UP1');
          setNoOrderHasWalletFollowUp1Count(el.last_week_count);
          setNoOrderHasWalletFollowUp1Percentage(percentage);
          break;
        case funnelStage.NoOrderHasWalletFollowUp2:
          setNoOrderHasWalletFollowUp2Text('FOLLOW UP2');
          setNoOrderHasWalletFollowUp2Count(el.last_week_count);
          setNoOrderHasWalletFollowUp2Percentage(percentage);
          break;
        case funnelStage.NoOrderHasWalletRetained:
          setNoOrderHasWalletRetainedText('RETAINED STAGE');
          setNoOrderHasWalletRetainedCount(el.last_week_count);
          setNoOrderHasWalletRetainedPercentage(percentage);
          break;
      }
    });
  }

  function setReActivationValue(data: FunnelInsight[]) {
    let baseValue = 0;
    data.forEach((el) => {
      if (el.stage !== funnelStage.ReActivationChurned && el.stage !== funnelStage.ReActivationDormant) {
        const percentage = el.prev_stage_last_week_count
          ? `${((el.last_week_count / (baseValue || el.prev_stage_last_week_count)) * 100).toFixed(2)}%`
          : '0%';
        if (baseValue === 0) baseValue = el.last_week_count;

        switch (el.stage) {
          case funnelStage.ReActivationContacted:
            setFirstText('CONTACTED');
            setFirstCount(el.last_week_count);
            setFirstPercentage(percentage);
            break;
          case funnelStage.ReActivationInProgress:
            setSecondText('RE-ACTIVATING');
            setSecondCount(el.last_week_count);
            setSecondPercentage(percentage);
            break;
          case funnelStage.ReActivated:
            setThirdText('RE-ACTIVATED');
            setThirdCount(el.last_week_count);
            setThirdPercentage(percentage);
            break;
        }
      }
    });
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="animate-spin text-teal-500" size={48} />
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      )}
      {!error && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            {(type === 1 || type === 2) && (
              <div className="funnel-container">
                <div className="funnel-main w-[625px] mx-auto min-w-[600px] space-y-4">
                  {isNoOrderNoFirstText && (
                    <FunnelSegment
                      color="#ff8e6e"
                      offset={0}
                      title={noOrderNoFirstText}
                      count={noOrderNoFirstCount}
                    />
                  )}
                  {isNoOrderNoRechargeText && (
                    <FunnelSegment
                      color="#30d9c4"
                      offset={50}
                      title={noOrderNoRechargeText}
                      count={noOrderNoRechargeCount}
                      percentage={noOrderNoRechargePercentage}
                    />
                  )}
                  {noOrderFollowUp1Text && (
                    <FunnelSegment
                      color="#30d9c4"
                      offset={100}
                      title={noOrderFollowUp1Text}
                      count={noOrderFollowUp1Count}
                      percentage={noOrderFollowUp1Percentage}
                    />
                  )}
                  {isNoOrderRechargedText && (
                    <FunnelSegment
                      color="#30d9c4"
                      offset={150}
                      title={noOrderRechargedText}
                      count={noOrderRechargedCount}
                      percentage={noOrderRechargedPercentage}
                    />
                  )}
                  {noOrderFollowUp2Text && (
                    <FunnelSegment
                      color="#30d9c4"
                      offset={200}
                      title={noOrderFollowUp2Text}
                      count={noOrderFollowUp2Count}
                      percentage={noOrderFollowUp2Percentage}
                    />
                  )}
                  {isActivatedText && (
                    <FunnelSegment
                      color="#30d9c4"
                      offset={250}
                      title={activatedText}
                      count={activatedCount}
                      percentage={activatedPercentage}
                    />
                  )}
                </div>
              </div>
            )}
            {type === 3 && (
              <div className="funnel-container">
                <div className="funnel-main w-[625px] mx-auto min-w-[600px] space-y-4">
                  <FunnelSegment
                    color="#ff8e6e"
                    offset={0}
                    title={noOrderHasWalletText}
                    count={noOrderHasWalletCount}
                    percentage={noOrderHasWalletPercentage}
                  />
                  <FunnelSegment
                    color="#30d9c4"
                    offset={50}
                    title={noOrderHasWalletFollowUp1Text}
                    count={noOrderHasWalletFollowUp1Count}
                    percentage={noOrderHasWalletFollowUp1Percentage}
                  />
                  <FunnelSegment
                    color="#30d9c4"
                    offset={100}
                    title={noOrderHasWalletFollowUp2Text}
                    count={noOrderHasWalletFollowUp2Count}
                    percentage={noOrderHasWalletFollowUp2Percentage}
                  />
                  <FunnelSegment
                    color="#30d9c4"
                    offset={150}
                    title={noOrderHasWalletRetainedText}
                    count={noOrderHasWalletRetainedCount}
                    percentage={noOrderHasWalletRetainedPercentage}
                  />
                </div>
              </div>
            )}
            {type === 4 && (
              <div className="funnel-container">
                <div className="funnel-main w-[625px] mx-auto min-w-[600px] space-y-4">
                  <FunnelSegment
                    color="#30d9c4"
                    offset={50}
                    title={firstText}
                    count={firstCount}
                    percentage={firstPercentage}
                  />
                  <FunnelSegment
                    color="#30d9c4"
                    offset={100}
                    title={secondText}
                    count={secondCount}
                    percentage={secondPercentage}
                  />
                  <FunnelSegment
                    color="#30d9c4"
                    offset={150}
                    title={thirdText}
                    count={thirdCount}
                    percentage={thirdPercentage}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FunnelSegment({
  color,
  offset,
  title,
  count,
  percentage,
}: {
  color: string;
  offset: number;
  title: string;
  count: number;
  percentage?: string;
}) {
  return (
    <div
      className="relative h-[90px]"
      style={{
        marginInline: `${offset}px`,
        borderLeft: '45px solid transparent',
        borderRight: '45px solid transparent',
        borderTop: `76px solid ${color}`,
        borderRadius: offset === 0 ? '12px' : undefined,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center -top-[50px]">
        {percentage && (
          <span className="absolute left-2 top-2 text-white opacity-50 text-2xl font-bold">
            {percentage}
          </span>
        )}
        <span className="text-white uppercase text-sm font-medium w-[90%] text-center">
          {title}
        </span>
        <span className="absolute right-2 top-2 text-white text-2xl font-bold">
          {count}
        </span>
      </div>
    </div>
  );
}