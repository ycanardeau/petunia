// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as alert } from '@elastic/eui/es/components/icon/assets/alert';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as check } from '@elastic/eui/es/components/icon/assets/check';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as logoGithub } from '@elastic/eui/es/components/icon/assets/logo_github';
import { icon as menu } from '@elastic/eui/es/components/icon/assets/menu';
import { icon as question } from '@elastic/eui/es/components/icon/assets/question';
import { icon as warning } from '@elastic/eui/es/components/icon/assets/warning';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	alert,
	apps,
	arrowDown,
	check,
	cross,
	empty,
	logoGithub,
	menu,
	question,
	warning,
};

appendIconComponentCache(cachedIcons);
