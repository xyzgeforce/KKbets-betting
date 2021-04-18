import { CouponEventType } from 'models/CouponEvent.model';
import { AddAction } from 'store/actions/coupon';
import * as actionTypes from '../actions/actionTypes';

export interface CouponState {
    events: CouponEventType[];
    totalRate: number;
    amount: number;
    possibleWinnings: number;
    refreshCoupons: number;
}

const initialState = {
    events: [],
    totalRate: 1,
    amount: 10,
    possibleWinnings: 10,
    refreshCoupons: 0
};

const updateRate = (events: CouponEventType[]): number => {
    let total = 1;
    events.forEach((el) => {
        total *= el.course;
    });
    return +total.toFixed(2);
};

const reducer = (state: CouponState = initialState, action: AddAction): CouponState => {
    switch (action.type) {
        case actionTypes.COUPON_ADD_EVENT: {
            action = action as AddAction;
            const eventIndex = state.events.findIndex((el) => el.eventId === action.eventId);
            let newEvents: CouponEventType[] = [...state.events];

            const event: CouponEventType = {
                eventId: action.eventId,
                eventName: action.eventName,
                userBet: action.userBet,
                betType: action.betType,
                course: action.course
            };
            if (eventIndex !== -1) {
                newEvents[eventIndex] = event;
            } else {
                newEvents = [...newEvents, event];
            }

            const totalRate = updateRate(newEvents);

            return {
                ...state,
                totalRate,
                possibleWinnings: +(totalRate * state.amount).toFixed(0),
                events: newEvents
            };
        }
        default: {
            return state;
        }
        case actionTypes.COUPON_REMOVE_EVENT: {
            const updatedEvents = state.events.filter((el) => el.eventId !== action.eventId);

            const rate = updateRate(updatedEvents);
            const win = +(rate * state.amount).toFixed(0);

            return {
                ...state,
                events: updatedEvents,
                totalRate: rate,
                possibleWinnings: win
            };
        }
    }
};

export default reducer;