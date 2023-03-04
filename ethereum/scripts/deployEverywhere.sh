#!/bin/bash

# List of network names to test
networks=("scroll_alpha" "base")
#networks=("goerli")

# Loop through the list of networks
for network in "${networks[@]}"
do
  # Deploy the contract using the specified network
  standard_bounties_contract=$(npx hardhat run scripts/deployStandardBounties.ts --network "$network")
  echo "Deploying standard bounties to '$network' at $standard_bounties_contract"
  eavesdrop_contract=$(npx hardhat run scripts/deployEavesdrop.ts --network "$network")
  echo "Deploying eavesdrop to '$network' at $eavesdrop_contract"
  sleep 60
  # Verify the contract on Etherscan using the specified network and constructor arguments
  npx hardhat verify --network "$network" "$standard_bounties_contract"
  npx hardhat verify --network "$network" "$eavesdrop_contract" "OpenAsk Eavesdrop Payment Splitter v0.1" "EVE"

#  contract_address=$(echo "$deploy_output" | grep "Eavesdrop deployed to address:" | awk '{print $NF}')
done
