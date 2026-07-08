# Security Spec: MSME360 Underwriting Firestore Security

This document outlines the security architecture, data invariants, adversarial payloads, and automated test runner logic for the MSME360 application's Firestore database rules.

---

## 1. Data Invariants

Our data security architecture enforces strict attribute-based access control (ABAC) to guarantee data privacy, role-based safety, and ledger immutability:

1. **User Identity Invariant**: A document under `/users/{userId}` is bound to a single authentic account. The `userId` path variable must exactly match the authenticated `request.auth.uid`. No user can modify another user's profile.
2. **Role Immutability Invariant**: Standard users (`msme_owner`) are strictly forbidden from self-assigning high-privilege roles like `credit_officer` or `administrator`. 
3. **MSME Profile Ownership Invariant**: A business profile stored in `/msme_profiles/{profileId}` must belong to the authenticated owner (`ownerId == request.auth.uid`). A standard user can only create, view, or update their own company's telemetry.
4. **Health Card Authorization Invariant**: Financial scoring health cards (`/health_cards/{cardId}`) represent official, bank-authorized alternative credit evaluations.
   - Only users with the validated role of `credit_officer` or `administrator` can create, update, or list health cards.
   - Standard MSME owners can only read (`get` or `list`) a health card if it belongs to them (`resource.data.msmeId == request.auth.uid` or `resource.data.ownerId == request.auth.uid`).
   - A health card score must lie strictly within the custom 300 to 900 FHS credit rating boundaries.
5. **Terminal State Integrity**: Once a health card reaches a terminal assessment status (e.g. `APPROVED` or `REJECTED`), it is locked. No subsequent updates can modify the score, except by a verified `administrator`.
6. **Audit Trail Immutability**: Documents in `/audit_logs/{logId}` capture operational and underwriting telemetry. Any authenticated user can append an entry (`create`), but no user (including admins and credit officers) is permitted to edit (`update`) or prune (`delete`) logs to preserve audit trails. Only administrators and credit officers can query (`read`) the logs.

---

## 2. The "Dirty Dozen" Malicious Payloads

These 12 JSON payloads are designed to attack the laws of Identity, Integrity, and State:

### Attack 1: User Profile Privilege Escalation
An attacker tries to self-register or update their profile to grant themselves the `administrator` role.
```json
// Path: /users/attacker-uid
{
  "uid": "attacker-uid",
  "email": "attacker@gmail.com",
  "name": "Malicious Actor",
  "role": "administrator",
  "company": "Shell Corp LLC",
  "createdAt": "2026-07-08T00:00:00Z"
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails role constraint check).

### Attack 2: Identity Spoofing (Shadow Profile Creation)
An attacker tries to write a profile document for a different victim's UID.
```json
// Path: /users/victim-uid
{
  "uid": "victim-uid",
  "email": "victim@gmail.com",
  "name": "Victim Business",
  "role": "msme_owner",
  "company": "Victim SME Corp",
  "createdAt": "2026-07-08T00:00:00Z"
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails path uid matching check).

### Attack 3: Ghost Field Injection (Shadow Update)
An attacker attempts to write unmapped, unauthorized properties to their profile to exploit potential schema-parsing gaps.
```json
// Path: /users/attacker-uid
{
  "uid": "attacker-uid",
  "email": "attacker@gmail.com",
  "name": "Malicious Actor",
  "role": "msme_owner",
  "company": "Shell Corp LLC",
  "createdAt": "2026-07-08T00:00:00Z",
  "isBypassed": true,
  "creditLimitOveride": 100000000
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails `affectedKeys().hasOnly()` or strict property list count).

### Attack 4: Temporal Timestamp Falsification
An attacker attempts to self-report an historical `createdAt` date instead of the server-controlled `request.time`.
```json
// Path: /users/attacker-uid
{
  "uid": "attacker-uid",
  "email": "attacker@gmail.com",
  "name": "Malicious Actor",
  "role": "msme_owner",
  "company": "Shell Corp LLC",
  "createdAt": "2010-01-01T00:00:00Z"
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails temporal server timestamp validation).

### Attack 5: MSME Profile Hijacking
A malicious user attempts to create an MSME business profile with an `ownerId` referencing a different user's account.
```json
// Path: /msme_profiles/malicious-profile-id
{
  "id": "malicious-profile-id",
  "ownerId": "victim-user-uid",
  "businessName": "Hijacked Enterprise Ltd",
  "registrationNumber": "27AAACA9342R1Z8",
  "industryType": "Manufacturing",
  "dateOfIncorporation": "2018-05-12",
  "ownerName": "Victim Owner",
  "email": "victim@gmail.com",
  "phoneNumber": "+91 99999 88888",
  "address": {
    "street": "123 High Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "createdAt": "2026-07-08T00:00:00Z"
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails ownership validation `incoming().ownerId == request.auth.uid`).

### Attack 6: Cross-Tenant Data Harvesting
An authenticated MSME owner attempts to view a competitor's company profile.
```json
// Action: GET /msme_profiles/competitor-profile-id
// Authenticated as: request.auth.uid = "attacker-uid"
```
*Expected Result:* `PERMISSION_DENIED` (Fails read permission check).

### Attack 7: Score Bypass (Sovereign Underwriting Escalation)
A standard MSME owner attempts to create their own pre-approved prime credit card rating directly in `/health_cards`.
```json
// Path: /health_cards/fake-card-id
{
  "id": "fake-card-id",
  "msmeId": "attacker-uid",
  "msmeName": "Attacker Inc",
  "overallScore": 890,
  "riskRating": "LOW",
  "assessmentDate": "2026-07-08T00:00:00Z",
  "status": "APPROVED",
  "scores": {
    "gstReliability": 99,
    "bankStatementHealth": 99,
    "utilityReliability": 99,
    "tradeCreditReliability": 99
  },
  "alternateDataConnected": ["GSTN", "BANK", "TRADE", "UTILITY"]
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails credit officer role check).

### Attack 8: Resource Poisoning (Denial of Wallet Range Attack)
A rogue bank clerk attempts to write a health card with a score outside standard mathematical boundaries.
```json
// Path: /health_cards/card-123
{
  "id": "card-123",
  "msmeId": "some-msme-uid",
  "msmeName": "Valid MSME",
  "overallScore": 9999, // Out of limits (300-900)
  "riskRating": "LOW",
  "assessmentDate": "2026-07-08T00:00:00Z",
  "status": "APPROVED",
  "scores": {
    "gstReliability": 100,
    "bankStatementHealth": 100,
    "utilityReliability": 100,
    "tradeCreditReliability": 100
  },
  "alternateDataConnected": ["GSTN"]
}
```
*Expected Result:* `PERMISSION_DENIED` (Fails numeric score boundaries check).

### Attack 9: Terminal State Alteration
A compromised credit officer attempts to change a previously `REJECTED` or `APPROVED` health card's rating after the audit trial is closed.
```json
// Path: /health_cards/terminal-card-id
// Original state: status = APPROVED, overallScore = 740
// Attack update payload: overallScore = 850
```
*Expected Result:* `PERMISSION_DENIED` (Fails terminal state locking rule).

### Attack 10: Blanket Query Scraping (No Relational Bounds)
An authenticated standard user tries to run a blanket query for all MSME profiles in the system without specifying their own UID as filter.
```json
// Action: LIST /msme_profiles
// Authenticated as: standard user (role = msme_owner)
```
*Expected Result:* `PERMISSION_DENIED` (Fails `allow list` enforcer check because the rule explicitly checks that the queried resources match the client's UID).

### Attack 11: Audit Trail Erasure (Log Manipulation)
A rogue user attempts to overwrite or delete audit logs to conceal operational actions.
```json
// Path: /audit_logs/fraudulent-log-id
// Action: DELETE or UPDATE
```
*Expected Result:* `PERMISSION_DENIED` (Logs are write-once/immutable).

### Attack 12: Anonymous Query Injection
An unauthenticated browser client attempts to retrieve any active business underwriting telemetry.
```json
// Action: GET /health_cards/card-8492
// Request: Unauthenticated (request.auth == null)
```
*Expected Result:* `PERMISSION_DENIED` (Fails initial authentication gate).

---

## 3. The Test Runner: firestore.rules.test.ts

```typescript
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment, 
  assertFails, 
  assertSucceeds 
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import * as fs from "fs";

describe("MSME360 Underwriting Security Rules", () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "msme360-security-audit",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
        host: "127.0.0.1",
        port: 8080
      }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  // Reusable auth context creators
  const getUnauthenticatedDb = () => testEnv.unauthenticatedContext().firestore();
  const getAuthenticatedDb = (uid: string, email: string = "user@sme.com") => 
    testEnv.authenticatedContext(uid, { email, email_verified: true }).firestore();

  // Establish standard mock profile
  const setupMockProfile = async (uid: string, role: string) => {
    const adminDb = testEnv.unauthenticatedContext().firestore(); // admin context bypasses rules for seeding
    // Pre-seed role directory in users collection
    await setDoc(doc(adminDb, "users", uid), {
      uid,
      email: `${uid}@sme.com`,
      name: `Test ${role}`,
      role,
      company: "Sovereign Underwriters",
      createdAt: new Date().toISOString()
    });
  };

  // --- ATTACK 1: Role Escalation ---
  it("should block standard users from self-promoting to administrator or credit_officer", async () => {
    const db = getAuthenticatedDb("msme-owner-uid");
    const docRef = doc(db, "users", "msme-owner-uid");

    await assertFails(
      setDoc(docRef, {
        uid: "msme-owner-uid",
        email: "owner@sme.com",
        name: "MSME Owner",
        role: "administrator", // ATTACK
        company: "SME Inc",
        createdAt: new Date().toISOString()
      })
    );
  });

  // --- ATTACK 2: Identity Spoofing ---
  it("should block a user from creating a profile for a different UID", async () => {
    const db = getAuthenticatedDb("attacker-uid");
    const docRef = doc(db, "users", "victim-uid"); // ATTACK

    await assertFails(
      setDoc(docRef, {
        uid: "victim-uid",
        email: "victim@sme.com",
        name: "Victim Owner",
        role: "msme_owner",
        company: "Victim Company",
        createdAt: new Date().toISOString()
      })
    );
  });

  // --- ATTACK 3: Ghost Field Injection ---
  it("should reject updates containing undeclared keys / ghost fields", async () => {
    const db = getAuthenticatedDb("owner-uid");
    await setupMockProfile("owner-uid", "msme_owner");

    const docRef = doc(db, "users", "owner-uid");
    await assertFails(
      updateDoc(docRef, {
        name: "Updated Name",
        isBypassed: true, // ATTACK
        creditLimitOverride: 1000000 // ATTACK
      })
    );
  });

  // --- ATTACK 4: Temporal Timestamp Falsification ---
  it("should reject user-reported historic creation timestamps", async () => {
    const db = getAuthenticatedDb("owner-uid");
    const docRef = doc(db, "users", "owner-uid");

    await assertFails(
      setDoc(docRef, {
        uid: "owner-uid",
        email: "owner@sme.com",
        name: "Owner",
        role: "msme_owner",
        company: "SME",
        createdAt: "2010-01-01T00:00:00Z" // ATTACK (not server timestamp)
      })
    );
  });

  // --- ATTACK 5: MSME Profile Hijacking ---
  it("should reject creation of MSME Profiles with mismatched ownerId", async () => {
    const db = getAuthenticatedDb("attacker-uid");
    const docRef = doc(db, "msme_profiles", "profile-123");

    await assertFails(
      setDoc(docRef, {
        id: "profile-123",
        ownerId: "victim-uid", // ATTACK
        businessName: "Victim Business",
        registrationNumber: "27AAACA9342R1Z8",
        industryType: "Manufacturing",
        dateOfIncorporation: "2018-05-12",
        ownerName: "Victim",
        email: "victim@sme.com",
        phoneNumber: "+91 99999 88888",
        createdAt: new Date().toISOString()
      })
    );
  });

  // --- ATTACK 6: Cross-Tenant Data Harvesting ---
  it("should block normal users from reading other corporate MSME profiles", async () => {
    const adminDb = testEnv.unauthenticatedContext().firestore();
    await setDoc(doc(adminDb, "msme_profiles", "competitor-profile"), {
      id: "competitor-profile",
      ownerId: "competitor-uid",
      businessName: "Competitor Inc"
    });

    const db = getAuthenticatedDb("owner-uid");
    const docRef = doc(db, "msme_profiles", "competitor-profile");
    
    await assertFails(getDoc(docRef));
  });

  // --- ATTACK 7: Score Bypass ---
  it("should prevent normal MSME owners from creating scoring health cards", async () => {
    const db = getAuthenticatedDb("owner-uid");
    const docRef = doc(db, "health_cards", "card-123");

    await assertFails(
      setDoc(docRef, {
        id: "card-123",
        msmeId: "owner-uid",
        msmeName: "Owner SME",
        overallScore: 850, // ATTACK
        riskRating: "LOW",
        assessmentDate: new Date().toISOString(),
        status: "APPROVED"
      })
    );
  });

  // --- ATTACK 8: Out of Bounds Value Poisoning ---
  it("should reject scores outside standard credit boundaries", async () => {
    const db = getAuthenticatedDb("officer-uid");
    await setupMockProfile("officer-uid", "credit_officer");

    const docRef = doc(db, "health_cards", "card-123");
    await assertFails(
      setDoc(docRef, {
        id: "card-123",
        msmeId: "owner-uid",
        msmeName: "SME",
        overallScore: 999, // ATTACK (> 900)
        riskRating: "LOW",
        assessmentDate: new Date().toISOString(),
        status: "APPROVED"
      })
    );
  });

  // --- ATTACK 9: Terminal State Alteration ---
  it("should lock APPROVED health cards and reject officer modifications", async () => {
    const adminDb = testEnv.unauthenticatedContext().firestore();
    await setDoc(doc(adminDb, "health_cards", "terminal-card"), {
      id: "terminal-card",
      msmeId: "owner-uid",
      msmeName: "SME",
      overallScore: 720,
      riskRating: "MEDIUM",
      status: "APPROVED", // TERMINAL STATUS
      assessmentDate: new Date().toISOString()
    });

    const db = getAuthenticatedDb("officer-uid");
    await setupMockProfile("officer-uid", "credit_officer");

    const docRef = doc(db, "health_cards", "terminal-card");
    await assertFails(
      updateDoc(docRef, {
        overallScore: 890 // ATTACK
      })
    );
  });

  // --- ATTACK 10: Secure List Query Enforcer ---
  it("should block collection list calls that lack relational owner id filters", async () => {
    const db = getAuthenticatedDb("owner-uid");
    const colRef = collection(db, "msme_profiles");

    // Attacking with unfiltered query
    await assertFails(getDocs(colRef));

    // Passing with correct secure filters matching request UID
    const secureQuery = query(colRef, where("ownerId", "==", "owner-uid"));
    await assertSucceeds(getDocs(secureQuery));
  });

  // --- ATTACK 11: Audit Trail Erasure ---
  it("should reject updates or deletions of audit logs", async () => {
    const adminDb = testEnv.unauthenticatedContext().firestore();
    await setDoc(doc(adminDb, "audit_logs", "log-123"), {
      id: "log-123",
      timestamp: new Date().toISOString(),
      action: "RECONCILIATION"
    });

    const db = getAuthenticatedDb("officer-uid");
    const docRef = doc(db, "audit_logs", "log-123");

    await assertFails(updateDoc(docRef, { action: "REVISED" }));
    await assertFails(deleteDoc(docRef));
  });

  // --- ATTACK 12: Anonymous Access ---
  it("should deny unauthenticated clients from reading underwriting health cards", async () => {
    const db = getUnauthenticatedDb();
    const docRef = doc(db, "health_cards", "card-8492");

    await assertFails(getDoc(docRef));
  });
});
```
