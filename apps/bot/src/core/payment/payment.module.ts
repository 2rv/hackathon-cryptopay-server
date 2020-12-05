import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu';
import { Context } from '../../type';
import { UserBalanceService } from './user-balance.service';

const backButton = createBackMainMenuButtons(
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
);

const userBalanceService = new UserBalanceService();

export function InitBalanceModule() {
  this.balanceMenu = new MenuTemplate(async (ctx: Context) => {
    const userBalance = await userBalanceService.getAccountBalance(
      ctx.state.user,
    );

    return {
      text: ctx.i18n.t('BALANCE.STATUS', {
        rub: userBalance.totalBalance,
        btc: userBalance.bitcoinBalance,
      }),
      parse_mode: 'Markdown',
    };
  });

  this.menu.submenu(
    (ctx: Context) => ctx.i18n.t('MAIN_MENU.BALANCE'),
    'balance',
    this.balanceMenu,
    {
      hide: () => this.mainMenuToggle,
    },
  );

  this.balanceMenu.manualRow(backButton);
}
