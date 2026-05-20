// ─── Primitive value aliases ─────────────────────────────────────────────────
// The OFX parser returns all leaf values as strings, regardless of whether they
// represent numbers, dates, booleans, or enumerated codes.

/** OFX date-time: YYYYMMDD, YYYYMMDDHHMMSS, or YYYYMMDDHHMMSS.mmm[±HH:MM] */
export type OFXDateTime = string;

/** Signed decimal amount as a string, e.g. "123.45" or "-20.01" */
export type OFXAmount = string;

/** ISO-4217 three-letter currency code, e.g. "USD", "EUR", "NZD" */
export type CurrencyCode = string;

/** OFX boolean: "Y" or "N" */
export type OFXBoolean = 'Y' | 'N';

// ─── Enumerations ─────────────────────────────────────────────────────────────

/** Bank account type (ACCTTYPE) */
export type AccountType = 'CHECKING' | 'SAVINGS' | 'MONEYMRKT' | 'CREDITLINE' | 'CD';

/**
 * Statement transaction type (TRNTYPE).
 * CREDIT=generic credit, DEBIT=generic debit, INT=interest earned,
 * DIV=dividend, FEE=financial institution fee, SRVCHG=service charge,
 * DEP=deposit, ATM=ATM debit/credit, POS=point of sale debit,
 * XFER=transfer, CHECK=check, PAYMENT=electronic payment,
 * CASH=cash withdrawal, DIRECTDEP=direct deposit, DIRECTDEBIT=direct debit,
 * REPEATPMT=repeating payment/standing order, HOLD=only pending amount,
 * OTHER=other
 */
export type TransactionType =
  | 'CREDIT' | 'DEBIT' | 'INT' | 'DIV' | 'FEE' | 'SRVCHG'
  | 'DEP' | 'ATM' | 'POS' | 'XFER' | 'CHECK' | 'PAYMENT'
  | 'CASH' | 'DIRECTDEP' | 'DIRECTDEBIT' | 'REPEATPMT' | 'HOLD' | 'OTHER';

/** Response status severity */
export type SeverityType = 'INFO' | 'WARN' | 'ERROR';

/** Action for a corrective transaction */
export type CorrectiveAction = 'REPLACE' | 'DELETE';

/** Balance type for a generic balance aggregate */
export type BalanceType = 'DOLLAR' | 'PERCENT' | 'NUMBER';

/** Investment account type */
export type InvestmentAccountType = 'INDIVIDUAL' | 'JOINT' | 'TRUST' | 'CORPORATE';

/** US tax-advantaged account product type */
export type USProductType =
  | '401K' | '403B' | 'IRA' | 'KEOGH' | 'OTHER'
  | 'SARSEP' | 'SIMPLE' | 'NORMAL' | 'TDA' | 'TRUST' | 'UGMA';

/** Source of funds in a 401(k) transaction */
export type Investment401kSource =
  | 'PRETAX' | 'AFTERTAX' | 'MATCH' | 'PROFITSHARING'
  | 'ROLLOVER' | 'OTHERVEST' | 'OTHERNONVEST';

/** Sub-account for investment transactions */
export type SubAccountType = 'CASH' | 'MARGIN' | 'SHORT' | 'OTHER';

/** Investment position type */
export type PositionType = 'LONG' | 'SHORT';

/** Income type for investment income transactions */
export type IncomeType = 'CGLONG' | 'CGSHORT' | 'DIV' | 'INTEREST' | 'MISC';

/** Sell reason for investment sell transactions */
export type SellReason = 'CALL' | 'MATURITY' | 'SELL';

/** Buy type for investment buy transactions */
export type BuyType = 'BUY' | 'BUYTOCOVER';

/** Sell type for investment sell transactions */
export type SellType = 'SELL' | 'SELLSHORT';

/** Transfer status code */
export type TransferStatus =
  | 'WILLPROCESSON' | 'POSTEDON' | 'NOFUNDSON' | 'CANCELEDON' | 'FAILEDON';

/** Loan account sub-type */
export type LoanAccountType =
  | 'AUTO' | 'CONSUMER' | 'MORTGAGE' | 'COMMERCIAL'
  | 'STUDENT' | 'MILITARY' | 'SMB' | 'CONSTR' | 'HOMEEQUITY';

/** Image type for check/statement images */
export type ImageType = 'STATEMENT' | 'TRANSACTION' | 'TAX';

/** Image reference type */
export type ImageRefType = 'OPAQUE' | 'URL' | 'FORMURL';

/** Check image support type */
export type CheckSupport = 'FRONTONLY' | 'BACKONLY' | 'FRONTANDBACK';

// ─── Common aggregates ────────────────────────────────────────────────────────

/** Status aggregate (STATUS): reports success or failure of a request */
export interface OFXStatus {
  /** Numeric status code; 0 = success */
  CODE: string;
  /** Severity of the status */
  SEVERITY: SeverityType;
  /** Optional human-readable status message */
  MESSAGE?: string;
}

/**
 * Currency aggregate (CURRENCY / ORIGCURRENCY).
 * Used to express an amount in a non-default currency.
 */
export interface OFXCurrency {
  /** Exchange rate: how many units of the account currency equal one unit of CURSYM */
  CURRATE: OFXAmount;
  /** ISO-4217 currency symbol */
  CURSYM: CurrencyCode;
}

/** Balance aggregate (BAL): a named balance value */
export interface OFXBalance {
  /** Name of the balance */
  NAME: string;
  /** Description of the balance */
  DESC: string;
  /** Type of value: DOLLAR (monetary), PERCENT, or NUMBER */
  BALTYPE: BalanceType;
  /** Balance value */
  VALUE: OFXAmount;
  /** Date/time as of which the balance is reported */
  DTASOF?: OFXDateTime;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
}

/** Check/statement image reference (IMAGEDATA) */
export interface OFXImageData {
  /** Image type */
  IMAGETYPE: ImageType;
  /** Reference to the image (URL, opaque token, etc.) */
  IMAGEREF: string;
  /** How to interpret IMAGEREF */
  IMAGEREFTYPE: ImageRefType;
  /** Days until image is available (alternative to DTIMAGEAVAIL) */
  IMAGEDELAY?: string;
  /** Date/time when image becomes available (alternative to IMAGEDELAY) */
  DTIMAGEAVAIL?: OFXDateTime;
  /** Total number of images */
  IMAGETTL?: string;
  /** Check image sides supported */
  CHECKSUP?: CheckSupport;
}

/** Payee address (PAYEE): full payee details including address */
export interface OFXPayee {
  /** Payee name */
  NAME: string;
  /** Street address line 1 */
  ADDR1: string;
  /** Street address line 2 */
  ADDR2?: string;
  /** Street address line 3 */
  ADDR3?: string;
  /** City */
  CITY: string;
  /** State/province */
  STATE: string;
  /** Postal/ZIP code */
  POSTALCODE: string;
  /** ISO-3166 three-letter country code */
  COUNTRY?: string;
  /** Phone number */
  PHONE: string;
}

/** OFX extension element (OFXELEMENT) */
export interface OFXElement {
  /** Tag name */
  TAGNAME: string;
  /** Optional display name */
  NAME?: string;
  /** Tag type */
  TAGTYPE?: string;
  /** Tag value */
  TAGVALUE: string;
}

/** OFX extension aggregate (OFXEXTENSION): vendor extension point */
export interface OFXExtension {
  /** One or more extension elements */
  OFXELEMENT: OFXElement | OFXElement[];
}

// ─── Account aggregates ───────────────────────────────────────────────────────

/**
 * Bank account (BANKACCTFROM / BANKACCTTO).
 * Identifies a bank, savings, money market, or CD account.
 */
export interface BankAccount {
  /** Routing/transit number (ABA for US institutions) */
  BANKID: string;
  /** Branch identifier (non-US) */
  BRANCHID?: string;
  /** Account number (up to 22 chars) */
  ACCTID: string;
  /** Account type */
  ACCTTYPE: AccountType;
  /** Optional account key for multi-factor situations */
  ACCTKEY?: string;
}

/**
 * Credit card account (CCACCTFROM / CCACCTTO).
 * Identifies a credit card account.
 */
export interface CreditCardAccount {
  /** Account number (up to 22 chars) */
  ACCTID: string;
  /** Optional account key */
  ACCTKEY?: string;
}

/**
 * Investment account (INVACCTFROM / INVACCTTO).
 * Identifies a brokerage/investment account.
 */
export interface InvestmentAccount {
  /** Broker identifier */
  BROKERID: string;
  /** Account number (up to 22 chars) */
  ACCTID: string;
}

/**
 * Loan account (LOANACCTFROM / LOANACCTTO).
 * Identifies a loan account.
 */
export interface LoanAccount {
  /** Loan account identifier */
  LOANACCTID: string;
  /** Loan account type */
  LOANACCTTYPE: LoanAccountType;
}

// ─── Security identifier ──────────────────────────────────────────────────────

/**
 * Security identifier (SECID).
 * Uniquely identifies a security using an industry standard ID system.
 */
export interface SecurityId {
  /** The security identifier value (e.g., CUSIP, ISIN, ticker) */
  UNIQUEID: string;
  /** The ID type system (e.g., "CUSIP", "ISIN", "TICKER") */
  UNIQUEIDTYPE: string;
}

// ─── Banking transactions ─────────────────────────────────────────────────────

/** Escrow amount breakdown (ESCRWAMT) */
export interface EscrowAmount {
  /** Total escrow amount */
  ESCRWTOTAL: OFXAmount;
  /** Tax component */
  ESCRWTAX?: OFXAmount;
  /** Insurance component */
  ESCRWINS?: OFXAmount;
  /** PMI (private mortgage insurance) component */
  ESCRWPMI?: OFXAmount;
  /** Fees component */
  ESCRWFEES?: OFXAmount;
  /** Other escrow component */
  ESCRWOTHER?: OFXAmount;
}

/** Loan payment breakdown within a statement transaction (LOANPMTINFO) */
export interface LoanPaymentInfo {
  /** Principal portion */
  PRINAMT: OFXAmount;
  /** Interest portion */
  INTAMT: OFXAmount;
  /** Escrow portion */
  ESCRWAMT?: EscrowAmount;
  /** Insurance portion */
  INSURANCE?: OFXAmount;
  /** Late fee amount */
  LATEFEEAMT?: OFXAmount;
  /** Other amount */
  OTHERAMT?: OFXAmount;
}

/**
 * Statement transaction (STMTTRN).
 * Represents a single posted transaction in a bank or credit card statement.
 */
export interface StatementTransaction {
  /** Transaction type */
  TRNTYPE: TransactionType;
  /** Date the transaction was posted to the account */
  DTPOSTED: OFXDateTime;
  /** Date the user initiated the transaction */
  DTUSER?: OFXDateTime;
  /** Date the transaction funds are available */
  DTAVAIL?: OFXDateTime;
  /** Transaction amount (negative = debit) */
  TRNAMT: OFXAmount;
  /** Loan payment breakdown (for loan accounts) */
  LOANPMTINFO?: LoanPaymentInfo;
  /** Financial institution transaction ID (up to 255 chars) */
  FITID: string;
  /** FITID of the transaction being corrected */
  CORRECTFITID?: string;
  /** Action to take on the corrected transaction */
  CORRECTACTION?: CorrectiveAction;
  /** Server-assigned transaction ID */
  SRVRTID?: string;
  /** Check number */
  CHECKNUM?: string;
  /** Reference number */
  REFNUM?: string;
  /** Standard Industry Code (SIC) */
  SIC?: string;
  /** Payee ID assigned by the financial institution */
  PAYEEID?: string;
  /** Payee name (short form; mutually exclusive with PAYEE) */
  NAME?: string;
  /** Full payee details including address (mutually exclusive with NAME) */
  PAYEE?: OFXPayee;
  /** Extended payee name (up to 100 chars) */
  EXTDNAME?: string;
  /** Destination bank account for transfers */
  BANKACCTTO?: BankAccount;
  /** Destination credit card account for transfers */
  CCACCTTO?: CreditCardAccount;
  /** Memo / narrative text */
  MEMO?: string;
  /** Check/statement image reference(s) (up to 2) */
  IMAGEDATA?: OFXImageData | OFXImageData[];
  /** Currency if transaction was in a currency other than the account default */
  CURRENCY?: OFXCurrency;
  /** Original currency before conversion to the account default */
  ORIGCURRENCY?: OFXCurrency;
  /** 401(k) fund source for retirement account transactions */
  INV401KSOURCE?: Investment401kSource;
}

/**
 * Pending transaction (STMTTRNP).
 * Like StatementTransaction but represents a pending (not yet posted) item.
 */
export interface PendingTransaction {
  /** Transaction type */
  TRNTYPE: TransactionType;
  /** Transaction date */
  DTTRAN: OFXDateTime;
  /** Date the hold/pending will expire */
  DTEXPIRE?: OFXDateTime;
  /** Transaction amount */
  TRNAMT: OFXAmount;
  /** Reference number */
  REFNUM?: string;
  /** Payee name */
  NAME: string;
  /** Extended payee name */
  EXTDNAME?: string;
  /** Memo / narrative */
  MEMO?: string;
  /** Check/statement image reference(s) */
  IMAGEDATA?: OFXImageData | OFXImageData[];
  /** Non-default currency */
  CURRENCY?: OFXCurrency;
  /** Original currency before conversion */
  ORIGCURRENCY?: OFXCurrency;
}

/**
 * Bank transaction list (BANKTRANLIST).
 * Contains the list of posted transactions for a given date range.
 */
export interface BankTransactionList {
  /** Start of the transaction date range */
  DTSTART: OFXDateTime;
  /** End of the transaction date range */
  DTEND: OFXDateTime;
  /**
   * Statement transactions. A single transaction is returned as an object;
   * multiple transactions are returned as an array.
   */
  STMTTRN?: StatementTransaction | StatementTransaction[];
}

/**
 * Pending transaction list (BANKTRANLISTP).
 * Contains pending/hold transactions as of a given date.
 */
export interface PendingTransactionList {
  /** Date/time as of which the list is current */
  DTASOF: OFXDateTime;
  /** Pending transactions (single or array) */
  STMTTRNP?: PendingTransaction | PendingTransaction[];
}

/** Ledger balance (LEDGERBAL): the posted/cleared balance */
export interface LedgerBalance {
  /** Balance amount */
  BALAMT: OFXAmount;
  /** Date/time as of the balance */
  DTASOF: OFXDateTime;
}

/** Available balance (AVAILBAL): funds available for withdrawal */
export interface AvailableBalance {
  /** Balance amount */
  BALAMT: OFXAmount;
  /** Date/time as of the balance */
  DTASOF: OFXDateTime;
}

/** List of named balance values (BALLIST) */
export interface BalanceList {
  /** One or more named balance entries */
  BAL?: OFXBalance | OFXBalance[];
}

// ─── Statement responses ──────────────────────────────────────────────────────

/**
 * Bank/credit-card statement response (STMTRS).
 * The main payload returned for a bank statement download request.
 */
export interface StatementResponse {
  /** Default currency for amounts in this statement (ISO-4217) */
  CURDEF: CurrencyCode;
  /** Account the statement is for */
  BANKACCTFROM: BankAccount;
  /** List of posted transactions */
  BANKTRANLIST?: BankTransactionList;
  /** List of pending transactions */
  BANKTRANLISTP?: PendingTransactionList;
  /** Posted ledger balance */
  LEDGERBAL: LedgerBalance;
  /** Available balance */
  AVAILBAL?: AvailableBalance;
  /** Cash advance balance amount */
  CASHADVBALAMT?: OFXAmount;
  /** Current interest rate */
  INTRATE?: OFXAmount;
  /** List of additional named balances */
  BALLIST?: BalanceList;
  /** Marketing information text */
  MKTGINFO?: string;
}

/**
 * Credit card statement response (CCSTMTRS).
 * Like StatementResponse but with a credit card account identifier.
 */
export interface CreditCardStatementResponse {
  /** Default currency for amounts (ISO-4217) */
  CURDEF: CurrencyCode;
  /** Credit card account the statement is for */
  CCACCTFROM: CreditCardAccount;
  /** List of posted transactions */
  BANKTRANLIST?: BankTransactionList;
  /** List of pending transactions */
  BANKTRANLISTP?: PendingTransactionList;
  /** Posted ledger balance */
  LEDGERBAL: LedgerBalance;
  /** Available balance */
  AVAILBAL?: AvailableBalance;
  /** Cash advance balance */
  CASHADVBALAMT?: OFXAmount;
  /** Current interest rate */
  INTRATE?: OFXAmount;
  /** List of additional named balances */
  BALLIST?: BalanceList;
  /** Marketing information */
  MKTGINFO?: string;
}

// ─── Investment types ─────────────────────────────────────────────────────────

/** Core investment transaction fields (INVTRAN) */
export interface InvestmentTransaction {
  /** Financial institution transaction ID */
  FITID: string;
  /** Server transaction ID */
  SRVRTID?: string;
  /** Trade date */
  DTTRADE: OFXDateTime;
  /** Settlement date */
  DTSETTLE?: OFXDateTime;
  /** FITID of the transaction being reversed */
  REVERSALFITID?: string;
  /** Memo/note */
  MEMO?: string;
}

/** Investment buy aggregate (INVBUY): common fields for all buy transactions */
export interface InvestmentBuy {
  /** Core transaction fields */
  INVTRAN: InvestmentTransaction;
  /** Security identifier */
  SECID: SecurityId;
  /** Number of units purchased */
  UNITS: OFXAmount;
  /** Price per unit */
  UNITPRICE: OFXAmount;
  /** Commission paid */
  COMMISSION?: OFXAmount;
  /** Taxes paid */
  TAXES?: OFXAmount;
  /** Fees paid */
  FEES?: OFXAmount;
  /** Load paid (for mutual funds) */
  LOAD?: OFXAmount;
  /** Total transaction cost (units * price + fees) */
  TOTAL: OFXAmount;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency before conversion */
  ORIGCURRENCY?: OFXCurrency;
  /** Sub-account type (CASH, MARGIN, SHORT, OTHER) */
  SUBACCTSEC: SubAccountType;
  /** Sub-account the funds came from */
  SUBACCTFUND: SubAccountType;
  /** Markup applied to price */
  MARKUP?: OFXAmount;
  /** Commission description */
  LOANID?: string;
  /** 401(k) loan principal */
  LOANPRINCIPAL?: OFXAmount;
  /** 401(k) loan interest */
  LOANINTEREST?: OFXAmount;
  /** 401(k) fund source */
  INV401KSOURCE?: Investment401kSource;
  /** Date/time of purchase for tax lot tracking */
  DTPURCHASE?: OFXDateTime;
  /** Shares per contract (for options) */
  SHARESPERCONTRACT?: string;
}

/** Investment sell aggregate (INVSELL): common fields for all sell transactions */
export interface InvestmentSell {
  /** Core transaction fields */
  INVTRAN: InvestmentTransaction;
  /** Security identifier */
  SECID: SecurityId;
  /** Number of units sold (negative = selling short) */
  UNITS: OFXAmount;
  /** Price per unit */
  UNITPRICE: OFXAmount;
  /** Commission paid */
  COMMISSION?: OFXAmount;
  /** Taxes paid */
  TAXES?: OFXAmount;
  /** Fees paid */
  FEES?: OFXAmount;
  /** Load paid */
  LOAD?: OFXAmount;
  /** Total proceeds (negative because it's a debit to the position) */
  TOTAL: OFXAmount;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency before conversion */
  ORIGCURRENCY?: OFXCurrency;
  /** Sub-account holding the position */
  SUBACCTSEC: SubAccountType;
  /** Sub-account receiving the proceeds */
  SUBACCTFUND: SubAccountType;
  /** Markdown applied to price */
  MARKDOWN?: OFXAmount;
  /** 401(k) fund source */
  INV401KSOURCE?: Investment401kSource;
}

/** Buy debt (bond) transaction (BUYDEBT) */
export interface BuyDebt {
  INVBUY: InvestmentBuy;
  /** Accrued interest */
  ACCRDINT?: OFXAmount;
}

/** Buy mutual fund transaction (BUYMF) */
export interface BuyMutualFund {
  INVBUY: InvestmentBuy;
  /** Buy type: BUY or BUYTOCOVER */
  BUYTYPE: BuyType;
  /** Related funds transaction ID */
  RELFITID?: string;
}

/** Buy option transaction (BUYOPT) */
export interface BuyOption {
  INVBUY: InvestmentBuy;
  /** Option buy type: BUYTOOPEN or BUYTOCLOSE */
  OPTBUYTYPE: 'BUYTOOPEN' | 'BUYTOCLOSE';
  /** Number of shares per contract */
  SHPERCTRCT: string;
}

/** Buy other security transaction (BUYOTHER) */
export interface BuyOther {
  INVBUY: InvestmentBuy;
}

/** Buy stock transaction (BUYSTOCK) */
export interface BuyStock {
  INVBUY: InvestmentBuy;
  /** Buy type: BUY or BUYTOCOVER */
  BUYTYPE: BuyType;
}

/** Sell debt (bond) transaction (SELLDEBT) */
export interface SellDebt {
  INVSELL: InvestmentSell;
  /** Sell reason: CALL (called away), MATURITY (matured), SELL (normal sale) */
  SELLREASON: SellReason;
  /** Accrued interest */
  ACCRDINT?: OFXAmount;
}

/** Sell mutual fund transaction (SELLMF) */
export interface SellMutualFund {
  INVSELL: InvestmentSell;
  /** Sell type: SELL or SELLSHORT */
  SELLTYPE: SellType;
  /** Average cost basis per unit */
  AVGCOSTBASIS?: OFXAmount;
  /** Related funds transaction ID */
  RELFITID?: string;
}

/** Sell option transaction (SELLOPT) */
export interface SellOption {
  INVSELL: InvestmentSell;
  /** Option sell type: SELLTOOPEN or SELLTOCLOSE */
  OPTSELLTYPE: 'SELLTOOPEN' | 'SELLTOCLOSE';
  /** Number of shares per contract */
  SHPERCTRCT: string;
  /** Related option positions */
  RELFITID?: string;
  /** Related option relationship: SPREAD, STRADDLE, NONE, OTHER */
  RELTYPE?: 'SPREAD' | 'STRADDLE' | 'NONE' | 'OTHER';
  /** Security ID of related option */
  SECID?: SecurityId;
  /** Whether the option was secured: NAKED or COVERED */
  SECURED?: 'NAKED' | 'COVERED';
}

/** Sell other security transaction (SELLOTHER) */
export interface SellOther {
  INVSELL: InvestmentSell;
}

/** Sell stock transaction (SELLSTOCK) */
export interface SellStock {
  INVSELL: InvestmentSell;
  /** Sell type: SELL or SELLSHORT */
  SELLTYPE: SellType;
}

/** Option closure transaction (CLOSUREOPT) */
export interface ClosureOption {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Number of options closed */
  UNITS: OFXAmount;
  /** Option buy or sell type */
  OPTACTION: 'EXERCISE' | 'ASSIGN' | 'EXPIRE';
  /** Sub-account */
  SUBACCTSEC: SubAccountType;
  /** Shares per contract */
  SHPERCTRCT: string;
  /** Related transaction ID */
  RELFITID?: string;
  /** Related option gain/loss */
  GAIN?: OFXAmount;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Dividend / interest income transaction (INCOME) */
export interface InvestmentIncome {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Income type */
  INCOMETYPE: IncomeType;
  /** Income amount */
  TOTAL: OFXAmount;
  /** Sub-account holding the security */
  SUBACCTSEC: SubAccountType;
  /** Sub-account receiving the income */
  SUBACCTFUND: SubAccountType;
  /** Whether taxes were withheld */
  TAXEXEMPT?: OFXBoolean;
  /** Withholding amount */
  WITHHOLDING?: OFXAmount;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency */
  ORIGCURRENCY?: OFXCurrency;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Investment expense transaction (INVEXPENSE) */
export interface InvestmentExpense {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Expense amount */
  TOTAL: OFXAmount;
  /** Sub-account */
  SUBACCTSEC: SubAccountType;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency */
  ORIGCURRENCY?: OFXCurrency;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Journal fund transfer (JRNLFUND): moves cash between sub-accounts */
export interface JournalFund {
  INVTRAN: InvestmentTransaction;
  /** Sub-account funds come from */
  SUBACCTFROM: SubAccountType;
  /** Sub-account funds go to */
  SUBACCTTO: SubAccountType;
  /** Amount transferred */
  TOTAL: OFXAmount;
}

/** Journal security transfer (JRNLSEC): moves securities between sub-accounts */
export interface JournalSecurity {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Sub-account securities come from */
  SUBACCTFROM: SubAccountType;
  /** Sub-account securities go to */
  SUBACCTTO: SubAccountType;
  /** Number of units transferred */
  UNITS: OFXAmount;
}

/** Margin interest transaction (MARGININTEREST) */
export interface MarginInterest {
  INVTRAN: InvestmentTransaction;
  /** Interest amount charged */
  TOTAL: OFXAmount;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency */
  ORIGCURRENCY?: OFXCurrency;
}

/** Dividend reinvestment transaction (REINVEST) */
export interface Reinvest {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Income type for the reinvested amount */
  INCOMETYPE: IncomeType;
  /** Total reinvested */
  TOTAL: OFXAmount;
  /** Sub-account */
  SUBACCTSEC: SubAccountType;
  /** Number of units reinvested */
  UNITS: OFXAmount;
  /** Price per unit */
  UNITPRICE: OFXAmount;
  /** Commission */
  COMMISSION?: OFXAmount;
  /** Taxes */
  TAXES?: OFXAmount;
  /** Fees */
  FEES?: OFXAmount;
  /** Load */
  LOAD?: OFXAmount;
  /** Whether taxes were withheld */
  TAXEXEMPT?: OFXBoolean;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency */
  ORIGCURRENCY?: OFXCurrency;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Return of capital transaction (RETOFCAP) */
export interface ReturnOfCapital {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Amount returned */
  TOTAL: OFXAmount;
  /** Sub-account holding the security */
  SUBACCTSEC: SubAccountType;
  /** Sub-account receiving the cash */
  SUBACCTFUND: SubAccountType;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Original currency */
  ORIGCURRENCY?: OFXCurrency;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Stock split transaction (SPLIT) */
export interface Split {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Sub-account */
  SUBACCTSEC: SubAccountType;
  /** Number of new units from the split */
  UNITS: OFXAmount;
  /** Number of old units before the split */
  OLDUNITS: OFXAmount;
  /** Numerator of the split ratio (e.g. 2 for a 2:1 split) */
  NUMERATOR: string;
  /** Denominator of the split ratio (e.g. 1 for a 2:1 split) */
  DENOMINATOR: string;
  /** Cash paid in lieu of fractional shares */
  FRACCASH?: OFXAmount;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Securities transfer (TRANSFER): moves positions between accounts */
export interface InvestmentTransfer {
  INVTRAN: InvestmentTransaction;
  SECID: SecurityId;
  /** Sub-account */
  SUBACCTSEC: SubAccountType;
  /** Number of units transferred */
  UNITS: OFXAmount;
  /** Direction: IN (received) or OUT (sent) */
  TFERACTION: 'IN' | 'OUT';
  /** Position type: LONG or SHORT */
  POSTYPE: PositionType;
  /** Average cost basis of transferred units */
  AVGCOSTBASIS?: OFXAmount;
  /** Tax lot average cost */
  UNITPRICE?: OFXAmount;
  /** Date of purchase for tax lot */
  DTPURCHASE?: OFXDateTime;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/**
 * Investment transaction list (INVTRANLIST).
 * All investment transaction types that can appear within the list.
 */
export interface InvestmentTransactionList {
  /** Start of the date range */
  DTSTART: OFXDateTime;
  /** End of the date range */
  DTEND: OFXDateTime;
  /** Buy debt transactions */
  BUYDEBT?: BuyDebt | BuyDebt[];
  /** Buy mutual fund transactions */
  BUYMF?: BuyMutualFund | BuyMutualFund[];
  /** Buy option transactions */
  BUYOPT?: BuyOption | BuyOption[];
  /** Buy other security transactions */
  BUYOTHER?: BuyOther | BuyOther[];
  /** Buy stock transactions */
  BUYSTOCK?: BuyStock | BuyStock[];
  /** Option closure transactions */
  CLOSUREOPT?: ClosureOption | ClosureOption[];
  /** Income transactions */
  INCOME?: InvestmentIncome | InvestmentIncome[];
  /** Investment expense transactions */
  INVEXPENSE?: InvestmentExpense | InvestmentExpense[];
  /** Journal fund transfers */
  JRNLFUND?: JournalFund | JournalFund[];
  /** Journal security transfers */
  JRNLSEC?: JournalSecurity | JournalSecurity[];
  /** Margin interest charges */
  MARGININTEREST?: MarginInterest | MarginInterest[];
  /** Reinvestment transactions */
  REINVEST?: Reinvest | Reinvest[];
  /** Return of capital transactions */
  RETOFCAP?: ReturnOfCapital | ReturnOfCapital[];
  /** Sell debt transactions */
  SELLDEBT?: SellDebt | SellDebt[];
  /** Sell mutual fund transactions */
  SELLMF?: SellMutualFund | SellMutualFund[];
  /** Sell option transactions */
  SELLOPT?: SellOption | SellOption[];
  /** Sell other security transactions */
  SELLOTHER?: SellOther | SellOther[];
  /** Sell stock transactions */
  SELLSTOCK?: SellStock | SellStock[];
  /** Stock split transactions */
  SPLIT?: Split | Split[];
  /** Transfer transactions */
  TRANSFER?: InvestmentTransfer | InvestmentTransfer[];
}

/** Investment position for a single security (INVPOS) */
export interface InvestmentPosition {
  /** Security identifier */
  SECID: SecurityId;
  /** Sub-account holding the position */
  HELDINACCT: SubAccountType;
  /** Position type: LONG or SHORT */
  POSTYPE: PositionType;
  /** Number of units held */
  UNITS: OFXAmount;
  /** Price per unit */
  UNITPRICE: OFXAmount;
  /** Market value (units × price) */
  MKTVAL: OFXAmount;
  /** Average cost basis per unit */
  AVGCOSTBASIS?: OFXAmount;
  /** Date/time of the price */
  DTPRICEASOF: OFXDateTime;
  /** Currency if different from account default */
  CURRENCY?: OFXCurrency;
  /** Memo/note */
  MEMO?: string;
  /** 401(k) source */
  INV401KSOURCE?: Investment401kSource;
}

/** Debt position (POSDEBT) */
export interface PositionDebt {
  INVPOS: InvestmentPosition;
}

/** Mutual fund position (POSMF) */
export interface PositionMutualFund {
  INVPOS: InvestmentPosition;
  /** Units available for redemption */
  UNITSSTREET?: OFXAmount;
  /** Units held in user's name */
  UNITSUSER?: OFXAmount;
  /** Reinvest dividends */
  REINVDIV?: OFXBoolean;
  /** Reinvest capital gains */
  REINVCG?: OFXBoolean;
}

/** Option position (POSOPT) */
export interface PositionOption {
  INVPOS: InvestmentPosition;
  /** Number of shares per contract */
  SHPERCTRCT: string;
}

/** Other position (POSOTHER) */
export interface PositionOther {
  INVPOS: InvestmentPosition;
}

/** Stock position (POSSTOCK) */
export interface PositionStock {
  INVPOS: InvestmentPosition;
  /** Units available (street name) */
  UNITSSTREET?: OFXAmount;
  /** Units in user's name */
  UNITSUSER?: OFXAmount;
  /** Reinvest dividends */
  REINVDIV?: OFXBoolean;
}

/** Investment position list (INVPOSLIST) */
export interface InvestmentPositionList {
  POSDEBT?: PositionDebt | PositionDebt[];
  POSMF?: PositionMutualFund | PositionMutualFund[];
  POSOPT?: PositionOption | PositionOption[];
  POSOTHER?: PositionOther | PositionOther[];
  POSSTOCK?: PositionStock | PositionStock[];
}

/** Investment account balance (INVBAL) */
export interface InvestmentBalance {
  /** Available cash balance */
  AVAILCASH: OFXAmount;
  /** Margin balance (negative = margin loan) */
  MARGINBALANCE: OFXAmount;
  /** Short balance (usually negative) */
  SHORTBALANCE: OFXAmount;
  /** Buying power */
  BUYPOWER?: OFXAmount;
  /** Additional named balances */
  BALLIST?: BalanceList;
}

/**
 * Investment statement response (INVSTMTRS).
 * Main payload for an investment account statement download.
 */
export interface InvestmentStatementResponse {
  /** Date/time of the statement */
  DTASOF: OFXDateTime;
  /** Default currency (ISO-4217) */
  CURDEF: CurrencyCode;
  /** Investment account */
  INVACCTFROM: InvestmentAccount;
  /** List of investment transactions */
  INVTRANLIST?: InvestmentTransactionList;
  /** Current positions */
  INVPOSLIST?: InvestmentPositionList;
  /** Account balances */
  INVBAL?: InvestmentBalance;
  /** 401(k) balance information */
  INV401KBAL?: Record<string, string>;
  /** Additional named balances */
  MKTGINFO?: string;
}

// ─── Securities list ──────────────────────────────────────────────────────────

/** Common security info (SECINFO) present in all security types */
export interface SecurityInfo {
  /** Security identifier */
  SECID: SecurityId;
  /** Full security name */
  SECNAME: string;
  /** Ticker symbol */
  TICKER?: string;
  /** FIID assigned by FI */
  FIID?: string;
  /** Rating */
  RATING?: string;
  /** Unit price */
  UNITPRICE?: OFXAmount;
  /** Date/time of unit price */
  DTASOF?: OFXDateTime;
  /** Currency */
  CURRENCY?: OFXCurrency;
  /** Memo/note */
  MEMO?: string;
}

/** Debt security (DEBTINFO) */
export interface DebtInfo {
  SECINFO: SecurityInfo;
  /** Par value */
  PARVALUE: OFXAmount;
  /** Debt class (COUPON, ZERO, MUNICIPAL, etc.) */
  DEBTCLASS?: string;
  /** Coupon rate */
  COUPONRT?: OFXAmount;
  /** Date of maturity */
  DTMAT?: OFXDateTime;
  /** Date of next coupon */
  DTCOUPON?: OFXDateTime;
  /** Coupon frequency */
  COUPONFREQ?: string;
  /** Call price */
  CALLPRICE?: OFXAmount;
  /** Yield to call */
  YIELDTOCALL?: OFXAmount;
  /** Date of first call */
  DTCALL?: OFXDateTime;
  /** Call type */
  CALLTYPE?: string;
  /** Yield to maturity */
  YIELDTOMAT?: OFXAmount;
  /** Date of issue */
  DTISSUE?: OFXDateTime;
  /** Whether bond is tax-exempt */
  BONDCLASS?: string;
  /** Asset classification */
  ASSETCLASS?: string;
  /** FI-defined asset class */
  FIASSETCLASS?: string;
}

/** Mutual fund security (MFINFO) */
export interface MutualFundInfo {
  SECINFO: SecurityInfo;
  /** Mutual fund type */
  MFTYPE?: string;
  /** 12b-1 fee */
  YIELD?: OFXAmount;
  /** Date of yield */
  DTYIELDASOF?: OFXDateTime;
}

/** Option security (OPTINFO) */
export interface OptionInfo {
  SECINFO: SecurityInfo;
  /** Underlying security SECID */
  SECID: SecurityId;
  /** Option type: CALL or PUT */
  OPTTYPE: 'CALL' | 'PUT';
  /** Strike price */
  STRIKEPRICE: OFXAmount;
  /** Expiration date */
  DTEXPIRE: OFXDateTime;
  /** Number of shares per contract */
  SHPERCTRCT: string;
  /** Asset classification */
  ASSETCLASS?: string;
  /** FI-defined asset class */
  FIASSETCLASS?: string;
}

/** Other security (OTHERINFO) */
export interface OtherInfo {
  SECINFO: SecurityInfo;
  /** Type description */
  TYPEDESC?: string;
  /** Asset classification */
  ASSETCLASS?: string;
  /** FI-defined asset class */
  FIASSETCLASS?: string;
}

/** Stock security (STOCKINFO) */
export interface StockInfo {
  SECINFO: SecurityInfo;
  /** Stock type */
  STOCKTYPE?: string;
  /** Dividend yield */
  YIELD?: OFXAmount;
  /** Date of yield */
  DTYIELDASOF?: OFXDateTime;
  /** Asset classification */
  ASSETCLASS?: string;
  /** FI-defined asset class */
  FIASSETCLASS?: string;
}

/** Securities list (SECLIST) */
export interface SecurityList {
  DEBTINFO?: DebtInfo | DebtInfo[];
  MFINFO?: MutualFundInfo | MutualFundInfo[];
  OPTINFO?: OptionInfo | OptionInfo[];
  OTHERINFO?: OtherInfo | OtherInfo[];
  STOCKINFO?: StockInfo | StockInfo[];
}

// ─── Signon message set ───────────────────────────────────────────────────────

/** Financial institution identification (FI) */
export interface FinancialInstitution {
  /** Organization name */
  ORG: string;
  /** FI identifier */
  FID?: string;
}

/**
 * Signon response (SONRS).
 * Returned by the server in response to a signon request.
 */
export interface SignonResponse {
  /** Status of the signon */
  STATUS: OFXStatus;
  /** Server date/time */
  DTSERVER: OFXDateTime;
  /** Session key (for USERKEY-based authentication) */
  USERKEY?: string;
  /** Date/time the session key expires */
  TSKEYEXPIRE?: OFXDateTime;
  /** ISO-639 three-letter language code */
  LANGUAGE: string;
  /** Date/time the FI profile was last updated */
  DTPROFUP?: OFXDateTime;
  /** Date/time the user profile was last updated */
  DTUSERUP?: OFXDateTime;
  /** Date/time the account list was last updated */
  DTACCTUP?: OFXDateTime;
  /** Financial institution information */
  FI?: FinancialInstitution;
  /** Session cookie */
  SESSCOOKIE?: string;
  /** Access key */
  ACCESSKEY?: string;
  /** Extension data */
  OFXEXTENSION?: OFXExtension;
}

/**
 * Signon request (SONRQ).
 * Sent by the client to authenticate with the server.
 */
export interface SignonRequest {
  /** Client date/time */
  DTCLIENT: OFXDateTime;
  /** User ID (used with USERPASS) */
  USERID?: string;
  /** Password (used with USERID) */
  USERPASS?: string;
  /** Session key (alternative to USERID/USERPASS) */
  USERKEY?: string;
  /** Access token (alternative authentication) */
  ACCESSTOKEN?: string;
  /** Whether to generate a user key */
  GENUSERKEY?: OFXBoolean;
  /** ISO-639 language code */
  LANGUAGE: string;
  /** Financial institution */
  FI?: FinancialInstitution;
  /** Session cookie */
  SESSCOOKIE?: string;
  /** Application ID (Quicken, Money, etc.) */
  APPID: string;
  /** Application version */
  APPVER: string;
  /** Application key */
  APPKEY?: string;
  /** Client UUID (RFC 4122) */
  CLIENTUID?: string;
  /** Additional user credential 1 */
  USERCRED1?: string;
  /** Additional user credential 2 */
  USERCRED2?: string;
  /** Auth token for two-factor authentication */
  AUTHTOKEN?: string;
  /** Access key */
  ACCESSKEY?: string;
  /** Extension data */
  OFXEXTENSION?: OFXExtension;
}

// ─── Transaction wrappers ─────────────────────────────────────────────────────

/**
 * Generic transaction response wrapper.
 * All specific transaction responses (STMTTRNRS, CCSTMTTRNRS, etc.) share
 * these fields from AbstractTransactionResponse.
 */
export interface TransactionResponseBase {
  /** Client-assigned transaction UID */
  TRNUID: string;
  /** Response status */
  STATUS: OFXStatus;
  /** Client cookie echoed back */
  CLTCOOKIE?: string;
  /** Extension data */
  OFXEXTENSION?: OFXExtension;
}

/** Bank statement transaction response (STMTTRNRS) */
export interface StatementTransactionResponse extends TransactionResponseBase {
  /** The statement response payload */
  STMTRS?: StatementResponse;
}

/** Credit card statement transaction response (CCSTMTTRNRS) */
export interface CreditCardStatementTransactionResponse extends TransactionResponseBase {
  /** The credit card statement response payload */
  CCSTMTRS?: CreditCardStatementResponse;
}

/** Investment statement transaction response (INVSTMTTRNRS) */
export interface InvestmentStatementTransactionResponse extends TransactionResponseBase {
  /** The investment statement response payload */
  INVSTMTRS?: InvestmentStatementResponse;
}

/** Securities list transaction response (SECLISTTRNRS) */
export interface SecuritiesListTransactionResponse extends TransactionResponseBase {
  /** The securities list payload */
  SECLIST?: SecurityList;
}

// ─── Message set wrappers ─────────────────────────────────────────────────────

/**
 * Signon message set response (SIGNONMSGSRSV1).
 * Always present in an OFX response.
 */
export interface SignonMessageSetResponse {
  /** Signon response */
  SONRS: SignonResponse;
}

/**
 * Signon message set request (SIGNONMSGSRQV1).
 */
export interface SignonMessageSetRequest {
  /** Signon request */
  SONRQ: SignonRequest;
}

/**
 * Banking message set response (BANKMSGSRSV1).
 * Contains bank statement, fund transfer, and stop-check responses.
 */
export interface BankingMessageSetResponse {
  /**
   * Statement transaction response(s).
   * A single response is an object; multiple are an array.
   */
  STMTTRNRS?: StatementTransactionResponse | StatementTransactionResponse[];
  /** Statement closing transaction response(s) */
  STMTENDTRNRS?: Record<string, any> | Record<string, any>[];
  /** Intrabank transfer transaction response(s) */
  INTRATRNRS?: Record<string, any> | Record<string, any>[];
  /** Recurring intrabank transfer transaction response(s) */
  RECINTRATRNRS?: Record<string, any> | Record<string, any>[];
  /** Stop check transaction response(s) */
  STPCHKTRNRS?: Record<string, any> | Record<string, any>[];
  /** Bank mail transaction response(s) */
  BANKMAILTRNRS?: Record<string, any> | Record<string, any>[];
}

/**
 * Credit card message set response (CREDITCARDMSGSRSV1).
 */
export interface CreditCardMessageSetResponse {
  /** Credit card statement transaction response(s) */
  CCSTMTTRNRS?: CreditCardStatementTransactionResponse | CreditCardStatementTransactionResponse[];
  /** Credit card statement closing response(s) */
  CCSTMTENDTRNRS?: Record<string, any> | Record<string, any>[];
}

/**
 * Investment statement message set response (INVSTMTMSGSRSV1).
 */
export interface InvestmentStatementMessageSetResponse {
  /** Investment statement transaction response(s) */
  INVSTMTTRNRS?: InvestmentStatementTransactionResponse | InvestmentStatementTransactionResponse[];
}

/**
 * Securities list message set response (SECLISTMSGSRSV1).
 */
export interface SecuritiesListMessageSetResponse {
  /** Securities list transaction response */
  SECLISTTRNRS?: SecuritiesListTransactionResponse | SecuritiesListTransactionResponse[];
  /** Inline securities list */
  SECLIST?: SecurityList;
}

// ─── Top-level OFX document ───────────────────────────────────────────────────

/**
 * The OFX document body (the `<OFX>` element).
 * Contains one or more message sets. In practice most files contain
 * SIGNONMSGSRSV1 and one data message set (bank, credit card, or investment).
 */
export interface OFXDocument {
  /** Signon response message set (almost always present in responses) */
  SIGNONMSGSRSV1: SignonMessageSetResponse;
  /** Signon request message set */
  SIGNONMSGSRQV1?: SignonMessageSetRequest;
  /** Banking response message set */
  BANKMSGSRSV1?: BankingMessageSetResponse;
  /** Banking request message set */
  BANKMSGSRQV1?: Record<string, any>;
  /** Credit card response message set */
  CREDITCARDMSGSRSV1?: CreditCardMessageSetResponse;
  /** Credit card request message set */
  CREDITCARDMSGSRQV1?: Record<string, any>;
  /** Investment statement response message set */
  INVSTMTMSGSRSV1?: InvestmentStatementMessageSetResponse;
  /** Investment statement request message set */
  INVSTMTMSGSRQV1?: Record<string, any>;
  /** Securities list response message set */
  SECLISTMSGSRSV1?: SecuritiesListMessageSetResponse;
  /** Securities list request message set */
  SECLISTMSGSRQV1?: Record<string, any>;
  /** Profile response message set */
  PROFMSGSRSV1?: Record<string, any>;
  /** Profile request message set */
  PROFMSGSRQV1?: Record<string, any>;
  /** Signup response message set */
  SIGNUPMSGSRSV1?: Record<string, any>;
  /** Signup request message set */
  SIGNUPMSGSRQV1?: Record<string, any>;
  /** Email response message set */
  EMAILMSGSRSV1?: Record<string, any>;
  /** Email request message set */
  EMAILMSGSRQV1?: Record<string, any>;
  /** Broker statement response message set */
  BROKERSTMTMSGSRSV1?: Record<string, any>;
  /** Wire transfer response message set */
  WIREXFERMSGSRSV1?: Record<string, any>;
  /** Bill pay response message set */
  BILLPAYMSGSRSV1?: Record<string, any>;
  /** Inter-institution transfer response message set */
  INTERXFERMSGSRSV1?: Record<string, any>;
  /** Presentment (biller delivery) response message set */
  PRESDIRMSGSRSV1?: Record<string, any>;
  /** Presentment delivery response message set */
  PRESDLVMSGSRSV1?: Record<string, any>;
  /** Loan response message set */
  LOANMSGSRSV1?: Record<string, any>;
  /** Unknown or additional top-level elements */
  [key: string]: any;
}

/**
 * The fully parsed OFX file.
 *
 * OFX files have two sections:
 * 1. A plain-text header with key:value pairs (before the `<OFX>` tag).
 * 2. An XML/SGML body starting with `<OFX>` containing message sets.
 *
 * All leaf values in the parsed document are strings, including numbers,
 * dates, and boolean flags (which use "Y"/"N").
 *
 * When an element can repeat, the parser returns a single object if there is
 * only one occurrence, or an array if there are multiple occurrences.
 *
 * @example
 * ```ts
 * const ofx = parseSync(fileContents);
 * const trns = ofx.OFX.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN;
 * const list = Array.isArray(trns) ? trns : trns ? [trns] : [];
 * ```
 */
export interface ParsedOFX {
  /**
   * File header fields parsed from the plain-text section before `<OFX>`.
   *
   * Standard fields for SGML (OFX 1.x):
   * - OFXHEADER: always "100"
   * - DATA: "OFXSGML" for SGML format
   * - VERSION: protocol version, e.g. "102", "151", "160"
   * - SECURITY: "NONE" or "TYPE1"
   * - ENCODING: character encoding, e.g. "USASCII", "UTF-8"
   * - CHARSET: Windows code page for USASCII, e.g. "1252"
   * - COMPRESSION: "NONE"
   * - OLDFILEUID: GUID of prior file, or "NONE"
   * - NEWFILEUID: GUID of this file, or "NONE"
   *
   * For OFX 2.x (XML), the header uses the same keys but appears as an
   * XML processing instruction.
   */
  header: {
    OFXHEADER?: string;
    DATA?: string;
    VERSION?: string;
    SECURITY?: string;
    ENCODING?: string;
    CHARSET?: string;
    COMPRESSION?: string;
    OLDFILEUID?: string;
    NEWFILEUID?: string;
    [key: string]: string | undefined;
  };
  /** The parsed OFX document body */
  OFX: OFXDocument;
}
