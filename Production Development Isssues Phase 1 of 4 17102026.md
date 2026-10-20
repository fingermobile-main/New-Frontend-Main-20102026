Here’s what remains. The recent pass mapped all 78 related PostgreSQL tables to management resources, but that does not yet mean every feature or screen is fully managed end to end.

Highest priority
Exercise writes across all 40 writable resources in the 12 domains. So far, the create, update, suspend, restore, audit, and read-only checks covered representative cases—not every resource.
Connect each domain’s user-facing screens to the same persisted data and management controls. The Master Dashboard console is in place, but per-screen integration and workflow checks are still outstanding.
Complete the commerce workflows. Storefront orders can remain pending; payment settlement/escrow and inventory reservation are not implemented here. Marketplace, Flamingo, and OwnIt still need focused workflow validation.
Remove the unused local/demo tracking code. The old Storefront tracking tabs are no longer reachable from the visible navigation, but their fixture data and local-only handlers remain in the source. See StorefrontTrackingPage.tsx.
After that
Validate lifecycle, audit, and automation behavior wherever supported, including failure and authorization cases.
Continue beyond these 12 domains to verify that all other platform consoles and screens are truly connected to their corresponding databases.
Keep the readability standard enforced as those screens are changed; the standard is documented in Test readability Core Standard Established 15102026.md.