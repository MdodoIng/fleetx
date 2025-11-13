'use client';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { vendorService } from '@/shared/services/vendor';
import { useAuthStore } from '@/store';
import { Check, Copy, Eye, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import LoadingPage from '../../loading';
import { toast } from 'sonner';

export default function PlatformGrid() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [integrationKeyDetails, setIntegrationKeyDetails] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any[]>([]);

  const { user } = useAuthStore();

  const setKeys = useCallback(
    (data: any, affiliationId: string) => {
      if (user?.roles.includes('VENDOR_USER')) {
        const activatedPlatform = platforms.find((p) => p.id === affiliationId);
        setIntegrationKeyDetails({
          id: affiliationId,
          branchId: user.user.vendor?.branch_id || 'BRANCH_001',
          name: activatedPlatform?.name || '',
        });
      }
    },
    [platforms, user, setIntegrationKeyDetails]
  );

  const getAffiliationList = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await vendorService.getAffiliationList();


      if (response?.data) {
        setPlatforms(response.data.affiliation || []);

        if (response.data.api_auth) {
          setActivate(response.data.api_auth?.affilication_id);
          setKeys(response.data, response.data.api_auth?.affilication_id);
        } else {
          setIntegrationKeyDetails(null);
        }
      } else {
        setPlatforms([]);
      }
    } catch (error) {
      console.error('Failed to fetch affiliation list:', error);

      setPlatforms([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAffiliationList();
  }, [getAffiliationList]);

  const activate = async (affiliationId: string) => {
    setSubmitted(true);

    const activePlatform = platforms.find((p) => p.activate);
    if (activePlatform) {
      console.warn(`You have already activated ${activePlatform.name}`);
      setSubmitted(false);
      return;
    }

    try {
      const request = {
        affilication_id: affiliationId,
      };
      const response: any = await vendorService.activateAffiliation(request);

      if (response.data) {
        setActivate(affiliationId);
        setActivateKeys(response.data, affiliationId);
        // Show success toast
        toast.success('Activated successfully');
      }
    } catch (error) {
      console.error('Activation failed:', error);
      // Show error message
    } finally {
      setSubmitted(false);
    }
  };

  const deActivate = (affiliationId: string) => {
    setPendingAction({ type: 'deactivate', id: affiliationId });
    setShowConfirmDialog(true);
  };

  const confirmDeActivate = async (affiliationId: string) => {
    if (!pendingAction) return;

    setSubmitted(true);
    setShowConfirmDialog(false);

    try {
      const request = {
        affilication_id: affiliationId,
      };
      const response: any = await vendorService.deactivateAffiliation(request);

      if (response.data) {
        setDeactivate();
        setIntegrationKeyDetails(null);
        // Show success toast
        toast.success('Deactivated successfully');
      }
    } catch (error) {
      console.error('Deactivation failed:', error);
      // Show error message
    } finally {
      setSubmitted(false);
      setPendingAction(null);
    }
  };

  const viewDetails = () => {
    setShowDetailsDialog(true);
  };

  const setActivate = (affiliationId: string) => {
    setPlatforms((prev) =>
      prev.map((platform) => ({
        ...platform,
        activate: platform.id === affiliationId,
      }))
    );
  };

  const setDeactivate = () => {
    setPlatforms((prev) =>
      prev.map((platform) => ({
        ...platform,
        activate: false,
      }))
    );
  };

  const setActivateKeys = (data: any, affiliationId: string) => {
    if (user?.roles.includes('VENDOR_USER')) {
      const activatedPlatform = platforms.find((p) => p.id === affiliationId);
      setIntegrationKeyDetails({
        id: affiliationId,
        branchId: user.user?.vendor?.branch_id || 'BRANCH_001',
        xApiKey: data.x_api_key,
        authKey: data.auth_key,
        name: activatedPlatform?.name || '',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard');
    });
  };

  // const hasActivePlatform = platforms.some((p) => p.activate);
  const activePlatform = platforms.find((p) => p.activate);

  if (loading) return <LoadingPage />;

  if (platforms.length === 0) {
    return (
      <Dashboard>
        <DashboardHeader>
          <DashboardHeaderRight />
        </DashboardHeader>
        <DashboardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Image
              src="/assets/images/nodata.png"
              alt="No data"
              width={200}
              height={200}
              className="mx-auto mb-4 opacity-50"
            />
            <p className="text-muted-foreground">
              Sorry, currently there are no integrators available.
            </p>
          </div>
        </DashboardContent>
      </Dashboard>
    );
  }

  return (
    <>
      <Dashboard>
        <DashboardHeader>
          <DashboardHeaderRight />
        </DashboardHeader>
        <DashboardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={cn(
                'transition-all duration-200',
                platform.activate && 'ring-2 ring-primary/20 bg-primary/5'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src={platform.logo_url}
                    alt={`${platform.name} logo`}
                    className="h-14 w-auto object-contain"
                    width={56}
                    height={56}
                  />
                </div>

                <CardTitle className="text-center mb-2">
                  {platform.name}
                </CardTitle>
                <CardDescription className="text-center mb-4">
                  {platform.description}
                </CardDescription>

                <div className="space-y-2">
                  {!platform.activate ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => activate(platform.id)}
                      disabled={submitted}
                    >
                      {submitted ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        'Activate'
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => deActivate(platform.id)}
                        disabled={submitted}
                      >
                        {submitted ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        )}
                      </Button>

                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={viewDetails}
                        disabled={submitted}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </DashboardContent>
      </Dashboard>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deactivation</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate the integration? This action
              will disable all active connections.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={submitted}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeActivate(pendingAction?.id)}
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Deactivation'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Integration Details</DialogTitle>
            <DialogDescription>
              Please share these details with {activePlatform?.name} for
              enabling the integration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchId">Branch ID</Label>
                <div className="flex">
                  <Input
                    id="branchId"
                    value={integrationKeyDetails?.branchId || 'BRANCH_001'}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() =>
                      copyToClipboard(
                        integrationKeyDetails?.branchId || 'BRANCH_001'
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {integrationKeyDetails?.authKey && (
                <div className="space-y-2">
                  <Label htmlFor="authKey">Auth Key</Label>
                  <div className="flex">
                    <Input
                      id="authKey"
                      value={integrationKeyDetails.authKey}
                      readOnly
                      className="flex-1"
                      type="password"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(integrationKeyDetails.authKey)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {integrationKeyDetails?.xApiKey && (
                <div className="space-y-2">
                  <Label htmlFor="xApiKey">X API Key</Label>
                  <div className="flex">
                    <Input
                      id="xApiKey"
                      value={integrationKeyDetails.xApiKey}
                      readOnly
                      className="flex-1"
                      type="password"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(integrationKeyDetails.xApiKey)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowDetailsDialog(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
