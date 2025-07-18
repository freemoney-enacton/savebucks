
import { Kysely, SqliteDialect } from 'kysely';
import { db } from "../../database";
async function seed(db: Kysely<any>) {
  // Chunk 1
    for (const item of [{"id":1,"name":"Lootably","code":"lootably","logo":"\nhttps://source.unsplash.com/user/c_v_r/100x100","type":"tasks","config_params":null,"postback_validation_key":"Wellcome@123","postback_key":"O8mTL3tItdsXlPirdX6Ztuu1S15vgYq2Vq8SeyroI71f7EnFA3wJAruemFUpev9cLyjE6oyrzHXHZZi6zg","api_key":"zqp9ggwduwkyp2v4e6blnlf347kfgbrxqy76smnref8","app_id":"clppdgm2007k701z229be65im","pub_id":null,"countries":"DE,CH,AT,IN","categories":"app,game,desktopgame,mobilegame,oneclick,signup,video,quiz,chromeextension,deposit,freetrial,multireward","enabled":1,"created_at":"2024-01-22T04:00:46.000Z","updated_at":"2024-01-22T04:00:46.000Z"},{"id":2,"name":"OfferToro","code":"torox","logo":"\nhttps://source.unsplash.com/user/c_v_r/100x100","type":"tasks","config_params":null,"postback_validation_key":"Wellcome@123","postback_key":"","api_key":"8558bf6836899a7a5834cf422538bca7","app_id":"15362","pub_id":"30404","countries":"DE,AT,CH","categories":null,"enabled":1,"created_at":"2024-01-22T05:17:43.000Z","updated_at":"2024-01-22T05:17:43.000Z"},{"id":3,"name":"Bitlabs Tasks","code":"bitlabs","logo":"\nhttps://source.unsplash.com/user/c_v_r/100x100","type":"tasks","config_params":"{\"secret\": \"dls0kDvELEXpSAO6x16jFvrx2VEyxVF6\"}","postback_validation_key":"Wellcome@123","postback_key":"a2e81c31-e5c4-41e6-97ee-9e24221b530a","api_key":"58027b2c-e9c4-4e38-abf7-290ad32b7082","app_id":null,"pub_id":null,"countries":"de,at,ch,in","categories":null,"enabled":1,"created_at":"2024-01-22T05:34:32.000Z","updated_at":"2024-01-22T05:34:32.000Z"},{"id":4,"name":"Bitlabs Surveys","code":"bitlabs","logo":"\nhttps://source.unsplash.com/user/c_v_r/100x100","type":"surveys","config_params":"{\"secret\": \"dls0kDvELEXpSAO6x16jFvrx2VEyxVF6\"}","postback_validation_key":"Wellcome@123","postback_key":"a2e81c31-e5c4-41e6-97ee-9e24221b530a","api_key":"73573453-9e36-4006-a19b-3bbccff61930","app_id":null,"pub_id":null,"countries":"de,at,ch,in","categories":null,"enabled":1,"created_at":"2024-01-22T05:34:32.000Z","updated_at":"2024-01-22T05:34:32.000Z"}]) {
      await db.insertInto('offerwall_networks').values(item).execute();
    }

}

seed(db).then(() => {
  console.log("Done!");
});
  