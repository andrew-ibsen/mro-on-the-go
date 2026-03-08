# Power Apps import artifacts (Stores Keeper)

Source files dropped by Andrew on WhatsApp and ingested here.

## Captured files
- `manifest.json`
- `app-definition.json`
- `identity.json`
- `logo.png`
- `stores-keeper.msapp.zip`
- `unpacked/` (expanded app source)

## Confirmed SharePoint data sources from app-definition
- Aer Lingus Stores Data JFK
- Airline Location JFK
- ANA Stores Data JFK
- ANZ Stores Data JFK
- BA Stores Data JFK
- Iberia Stores Data JFK
- Norse Stores Data JFK
- Qantas Stores Data JFK
- H10 Temp Log List
- T8 Temp Log List
- Stores Keeper Transaction Log
- User Feedback Log

## Integration impact
- Confirms multi-airline list strategy currently mirrored in MRO-on-the-GO stores model.
- Confirms two extra lists to implement next:
  - Stores Keeper Transaction Log (enhance transaction audit + user/action metadata)
  - User Feedback Log (new feedback endpoint + UI capture)
