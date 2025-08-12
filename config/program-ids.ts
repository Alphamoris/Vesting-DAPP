// Auto-generated program IDs for different networks
export const PROGRAM_IDS = {
  localnet: 'B5woVTwykhf4P4MHHawK3GgbHZBTT9Yvig426omjikB1',
  devnet: 'B5woVTwykhf4P4MHHawK3GgbHZBTT9Yvig426omjikB1',
  'mainnet-beta': 'B5woVTwykhf4P4MHHawK3GgbHZBTT9Yvig426omjikB1',
} as const;

export const getCurrentProgramId = (network: string) => {
  return PROGRAM_IDS[network as keyof typeof PROGRAM_IDS] || PROGRAM_IDS.devnet;
};
