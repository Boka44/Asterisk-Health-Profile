# Astra

Astra is a platform for collecting and storing women's health data. It is built on top of the Akave and Vana protocols, and includes a telegram bot and mini app with Self.xyz for zk-proof identity verification.

Can switch to a feature based architecture to scale.

## To Do For V2
- [ ] Implement logging
- [ ] Set up production environment
- [ ] Optimize localized notifications in telegram

## Service Architecture

### Data Collection

Data is collected from a telegram bot and mini app. The bot is used to collect user data and the mini app is used to collect health data. This process is creates a web2 experience for users.

### Data Flow
The application handles health data through multiple services:

1. **Akave Service (`services/akave.js`)**
   - Handles encrypted data storage on O3 (Object Storage)
   - Uses OpenPGP encryption for data security
   - Maintains data integrity through consistent encryption/decryption processes
   - Stores both health profiles and daily check-ins

2. **Vana Service (`services/vana.js`)**
   - Manages data contribution to the Vana data liquidity pool
   - Handles file registration and permission management
   - Implements TEE (Trusted Execution Environment) proof submission
   - Manages reward claiming for data contributions

### Upload Process

#### Akave Upload Flow
1. Data is first converted to a File object
2. File is encrypted using OpenPGP with user's signature
3. Encrypted data is uploaded to O3 storage
4. Returns a signed URL for future access

#### Vana Upload Flow
1. Takes the O3 storage URL from Akave
2. Registers the file with the Data Registry contract
3. Requests contribution proof from TEE Pool
4. Submits proof to TEE with:
   - Fixed IV and ephemeral keys for consistent encryption
   - Permission validation parameters
   - Encrypted encryption key for TEE
5. Claims rewards upon successful proof submission

### Security Features
- Consistent encryption parameters across services
- Permission-based access control
- TEE validation for secure data processing
- Checksum verification for data integrity

### Queue System
The application uses a Bull queue system to handle:
- Asynchronous data uploads
- Retry mechanisms for failed uploads
- State management between upload attempts
- Parallel processing of health and check-in data

This architecture ensures:
- Data privacy through encryption
- Reliable data storage and contribution
- Consistent reward distribution
- Scalable processing of user data


# Dev Notes

## Vana

Proofs and contracts are stored in different repositories.


## Akave O3

Summary Table:
| Action | Command Example |
|----------------|--------------------------------------------------------------------------------|
| List buckets | aws s3 ls --profile akave --endpoint-url https://o3-rc2.akave.xyz |
| Make bucket | aws s3 mb s3://asterisk-checkin-data --profile akave --endpoint-url https://o3-rc2.akave.xyz |
| List contents | aws s3 ls s3://my-bucket --profile akave --endpoint-url https://o3-rc2.akave.xyz |
| Remove bucket | aws s3 rb s3://my-bucket --profile akave --endpoint-url https://o3-rc2.akave.xyz |
