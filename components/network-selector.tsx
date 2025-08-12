import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Globe, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNetworkConnection, NetworkType, NETWORK_CONFIGS, checkLocalnetAvailability } from '@/lib/network-config';

export function NetworkSelector() {
  const { network, setNetwork, networkConfig, isLocalnet, isDevnet } = useNetworkConnection();
  const [localnetAvailable, setLocalnetAvailable] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check localnet availability on component mount
  useEffect(() => {
    checkLocalnetStatus();
  }, []);

  const checkLocalnetStatus = async () => {
    setChecking(true);
    try {
      const available = await checkLocalnetAvailability();
      setLocalnetAvailable(available);
    } catch (error) {
      setLocalnetAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
  };

  const getNetworkIcon = (networkType: NetworkType) => {
    switch (networkType) {
      case 'localnet':
        return <Monitor className="w-4 h-4" />;
      case 'devnet':
        return <Globe className="w-4 h-4" />;
      case 'mainnet-beta':
        return <Wifi className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getNetworkStatus = (networkType: NetworkType) => {
    if (networkType === 'localnet') {
      return localnetAvailable ? 'Available' : 'Not Running';
    }
    return 'Available';
  };

  const getStatusColor = (networkType: NetworkType) => {
    if (networkType === 'localnet') {
      return localnetAvailable ? 'default' : 'destructive';
    }
    return 'default';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getNetworkIcon(network)}
          Network Configuration
        </CardTitle>
        <CardDescription>
          Switch between Solana networks for testing and deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Network Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(network)}>
              {networkConfig.name}
            </Badge>
            <span className="text-sm text-gray-600">
              {getNetworkStatus(network)}
            </span>
          </div>
          {network === 'localnet' && (
            localnetAvailable ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            )
          )}
        </div>

        {/* Network Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Network:</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(NETWORK_CONFIGS).map(([key, config]) => (
              <Button
                key={key}
                variant={network === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNetworkChange(key as NetworkType)}
                disabled={key === 'localnet' && !localnetAvailable}
                className="justify-start"
              >
                <div className="flex items-center gap-2">
                  {getNetworkIcon(key as NetworkType)}
                  <span>{config.name}</span>
                  {key === 'localnet' && !localnetAvailable && (
                    <Badge variant="destructive" className="text-xs ml-auto">
                      Offline
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Localnet Instructions */}
        {!localnetAvailable && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-900">Localnet Not Available</p>
                <p className="text-orange-700 mt-1">
                  To start localnet, run: <code className="bg-orange-100 px-1 rounded">solana-test-validator</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Network Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkLocalnetStatus}
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Check Status'}
          </Button>
          
          {isLocalnet && !localnetAvailable && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNetwork('devnet')}
            >
              Switch to Devnet
            </Button>
          )}
        </div>

        {/* Network Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Endpoint:</strong> {networkConfig.endpoint}</p>
          <p><strong>Use for:</strong> {
            isLocalnet ? 'Fast local development & testing' :
            isDevnet ? 'Public testing with SOL faucet' :
            'Production deployment'
          }</p>
        </div>
      </CardContent>
    </Card>
  );
}
