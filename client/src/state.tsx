import { DtoResCollection, DtoResRecord } from '../../api/interfaces/dto_res';
import { DtoRecord } from '../../api/interfaces/dto_record';
import { StringUtil } from './utils/string_util';
import { RecordCategory } from './common/record_category';
import { RunResult } from '../../api/interfaces/dto_run_result';

export function getDefaultRecord(isInit: boolean = false): DtoRecord {
    return {
        id: isInit ? '@init' : StringUtil.generateUID(),
        category: RecordCategory.record,
        name: 'new request',
        collectionId: '',
        headers: []
    };
}

export interface RecordState {
    record: DtoRecord | DtoResRecord;

    isChanged: boolean;

    isRequesting: boolean;
}

export interface CollectionState {
    activeKey: string;

    recordState: RecordState[];

    responseState: ResponseState;
}

export interface ResponseState {
    [id: string]: RunResult | Error;
}

export interface State {
    collections: DtoResCollection[];

    collectionState: CollectionState;

    // teamState: TeamState;

    // documentState: DocumentState;

    // mockState: MockState;

    // stressTestState: StressTestState;
}

export const initialState: State = {
    collections: [],
    collectionState: {
        activeKey: '@init',
        recordState: [
            {
                record: getDefaultRecord(true),
                isChanged: false,
                isRequesting: false
            }
        ],
        responseState: {}
    },
};