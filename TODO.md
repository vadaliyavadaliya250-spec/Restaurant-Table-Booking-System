# TODO

## Planned change: remove SMS Fast2SMS dependency and send WhatsApp for auto-book
- [ ] Add WhatsApp URL builder (digits-only conversion) in `src/app/menu/page.tsx`
- [ ] Replace `sendWaitlistSms` usage in the auto-book effect with WhatsApp sending
- [ ] Stop calling `/api/sms/send` from the customer flow
- [ ] Ensure phone formatting matches admin: digits-only for `wa.me`
- [ ] Leave SMS API route intact (optional) or mark unused

