import { User } from 'apps/api/src/core/auth/user.entity';
import { UserBalance } from 'apps/api/src/core/payment/user-balance/user-balance.entity';
import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu';
import { getRepository } from 'typeorm';
import { Context } from '../../type';

const backButton = createBackMainMenuButtons(
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
);

export function InitBalanceModule() {
  this.balanceMenu = new MenuTemplate(async (ctx: Context) => {
    const user = await getRepository(User).findOne({
      where: { login: ctx.state?.user?.login },
    });

    const balance = await getRepository(UserBalance).findOne({
      where: { user },
    });

    const userBalance = {
      bitcoinBalance: balance.bitcoinBalance,
      usdBalance: await balance.calculateUsdBalance(),
      uahBalance: await balance.calculateUahBalance(),
    };

    return {
      text: ctx.i18n.t('BALANCE.STATUS', {
        uah: userBalance.uahBalance,
        usd: userBalance.usdBalance,
        btc: userBalance.bitcoinBalance,
      }),
      parse_mode: 'Markdown',
    };
  });

  this.menu.submenu(
    (ctx: Context) => {
      if (!this.isLogged) {
        return '';
      }
      return ctx.i18n.t('MAIN_MENU.BALANCE');
    },
    'balance',
    this.balanceMenu,
    {
      hide: () => this.mainMenuToggle,
    },
  );

  this.balanceMenu.manualRow(backButton);
}
