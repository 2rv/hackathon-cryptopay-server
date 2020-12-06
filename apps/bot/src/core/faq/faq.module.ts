import { Context } from '../../type';
import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu';

const backButton = createBackMainMenuButtons(
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
);

export function InitFaqModule() {
  this.faqMenu = new MenuTemplate((ctx: Context) => ({
    text: ctx.i18n.t('FAQ.INFO'),
    parse_mode: 'Markdown',
  }));

  this.faqMenu.manualRow(backButton);

  this.menu.submenu(
    async (ctx: Context) => {
      return ctx.i18n.t('MAIN_MENU.FAQ');
    },
    'faq',
    this.faqMenu,
    {
      hide: () => this.mainMenuToggle,
    },
  );
}
