# D Farms Design Backlog: UX Modernization
Generated from UAT Session with Logistics Head (Arjun)

| Priority | Feature | Module | Impact | Effort | Description |
|---|---|---|---|---|---|
| 1 | **Voice-to-Text Procurement Logging** | Procurement | High (Critical for Mandi usage) | High (Requires Whisper integration) | Enable one-tap audio recording for transactions. Agent parses speech to text. |
| 1 | **FEFO Visual Indicators** | Inventory | High (Reduces spoilage loss) | Low (Frontend logic) | Highlight batches expiring < 30 days in Red. Auto-sort by expiry. |
| 1 | **Farmer Payment Portal (Mobile PWA)** | Web/Mobile | High (Vendor Trust) | High | Mobile-optimized login for farmers to view payment status and ledger. |
| 2 | **Real-time Rate Widget Overlay** | Procurement | Medium | Medium | Show live market price difference (e.g., '+5% vs Market') next to the price input. |
| 3 | **Live Logistics Map** | Logistics | Medium | High | Mapbox integration to show warehouse and truck locations. |

## Feature: Voice-First Navigation
**Source:** UX Trends India
**Idea:** Add a microphone button to every screen. Farmers prefer speaking 'Add 100kg Chana' over typing.
**Priority:** Medium
**Status:** PROPOSED


## Feature: Employee Self-Service Portal
**Source:** Gap Hunter Audit
**Priority:** High
**Idea:** The system is missing the 'Human Resources & Payroll' module (specifically 'employees'). Implement the core tables and the Employee Self-Service Portal.
**Context:** Required for 'Human Resources & Payroll' compliance according to Universal Blueprint.

## Feature: Real-time Vehicle Tracking
**Source:** Gap Hunter Audit
**Priority:** High
**Idea:** The system is missing the 'Fleet & Logistics' module (specifically 'vehicles'). Implement the core tables and the Real-time Vehicle Tracking.
**Context:** Required for 'Fleet & Logistics' compliance according to Universal Blueprint.

## Feature: Automated Invoice OCR
**Source:** Gap Hunter Audit
**Priority:** Medium
**Idea:** The system is missing the 'Document Intelligence' module (specifically 'documents'). Implement the core tables and the Automated Invoice OCR.
**Context:** Required for 'Document Intelligence' compliance according to Universal Blueprint.

## Feature: System-wide Audit Trail
**Source:** Gap Hunter Audit
**Priority:** Critical
**Idea:** The system is missing the 'Security & Compliance' module (specifically 'audit_logs'). Implement the core tables and the System-wide Audit Trail.
**Context:** Required for 'Security & Compliance' compliance according to Universal Blueprint.
