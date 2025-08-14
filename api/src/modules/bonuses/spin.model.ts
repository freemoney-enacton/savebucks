import { sql } from "kysely";
import { db } from "../../database/database";
import { config } from "../../config/config";
import dayjs from "dayjs";
import { SpinConfiguration, Spins } from "../../database/db";
import { v4 as uuidv4 } from 'uuid';


const imagePrefix = `${config.env.app.image_url}`;

export const fetchSpin =  async (spin_code: string) => {
  const spinDetail = await db.selectFrom('spins')
    .select([
      "name",
      sql<string>`CONCAT(${imagePrefix},'/',image)`.as("image"),
      "code",
      "variable_rewards"
    ])
    .where('code','=',spin_code)
    .where("enabled", "=", 1)
    .executeTakeFirst();

  if(!spinDetail) return null;

  const spinConfigs = await db.selectFrom('spin_configuration')
    .select([
      "spin_code",
      "title",
      sql<string>`CONCAT(${imagePrefix},'/',icon)`.as("icon"),
      "code",
      "amount",
      "max_amount",
      "min_amount",
      "probability"
    ])
    .where('spin_code','=',spin_code)
    .where("enabled", "=", 1)
    .execute();

  let maxRewardAmount = spinConfigs
    .map(sc => spinDetail.variable_rewards ? sc.max_amount : sc.amount)
    .map(a => Number(a))
    .sort((a,b) => (a-b))
    .pop();

  const modifiedConfig = await modifyConfiguration(spinDetail, spinConfigs);

  return {
    spin: spinDetail,
    // config: spinConfigs,
    config: modifiedConfig,
    spinRange: spinDetail.variable_rewards ? spinConfigs : null,
    maxAmount: maxRewardAmount,
  };
}

const modifyConfiguration = async (spinDetail: any, spinConfig: any) => {
    return spinConfig
        .map((sc: any, pidx: number) => {
            // const count = Math.floor(Math.random() * 6) + 3;
            const count = 5;

            return Array(count)
                .fill('')
                .map((val: any, cidx: number) => {
                    
                    const rewardAmount = spinDetail.variable_rewards 
                        ? getRandomDecimal(Number(sc.min_amount), Number(sc.max_amount)) 
                        : sc.amount;

                    return {
                        spin_code: sc.spin_code,
                        title: sc.title,
                        icon: sc.icon,
                        code: sc.code + '_' + rewardAmount + '_' + pidx + '_' + cidx,
                        amount: rewardAmount,
                        probability: Number(sc.probability) / count,
                        sort_order: (cidx * 100) + pidx
                    };
                });
        })
        .reduce((acc: any, val: any) => acc.concat(val), [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order);
        // .sort(() => Math.random() - 0.5);
} 

export const getSpinRewards = (config: any) => {
  const totalProbability = config.reduce((sum: any, item: any) => sum + parseFloat(item.probability), 0);
  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;
  for (const item of config) {
      cumulativeProbability += parseFloat(item.probability);
      if (randomValue <= cumulativeProbability) {
          return item;
      }
  }
}

const getRandomDecimal = (min: number, max: number): number => {
  const randomDecimal = Math.random() * (max - min) + min;
  return parseFloat(randomDecimal.toFixed(2));
}

export const createUserSpin = async (
  spinDetails: any,
  userId: number,
  source: string
) => {
  const { spin, config, maxAmount } = spinDetails;
  
  let code: string = uuidv4().replace(/-/g, '').substr(0, 10);
  let isUnique = false;

  while (!isUnique) {
    code = uuidv4().replace(/-/g, '').substr(0, 10);
    const existingCode = await db
      .selectFrom('user_spins')
      .select('id')
      .where('code', '=', code)
      .executeTakeFirst();
    
    isUnique = !existingCode;
  }

  const result = await db
    .insertInto('user_spins')
    .values({
      user_id: userId,
      code: code,
      source,
      spin_code: spin.code,
      spin_config: JSON.stringify(config),
      max_reward_amount: maxAmount,
      status: 'available',
      awarded_at: new Date(),
    })
    .execute();

  return code;
};

export const getUserSpin = async (userSpinCode: string) => {
  const result=await db.selectFrom("user_spins")
    .selectAll()
    .where("code","=",userSpinCode)
    .executeTakeFirst();

    return result
}

export const claimUserSpin = async (userSpinCode: string, reward_code: string) => {
  return db.updateTable("user_spins")
    .where("code","=",userSpinCode)
    .set({
      "status": "claimed",
      "reward_code": reward_code,
    })
    .execute();
}