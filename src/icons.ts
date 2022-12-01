// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as alert } from '@elastic/eui/es/components/icon/assets/alert';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as questionInCircle } from '@elastic/eui/es/components/icon/assets/question_in_circle';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	alert,
	apps,
	arrowDown,
	questionInCircle,
};

appendIconComponentCache(cachedIcons);
