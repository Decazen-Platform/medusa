import { useAdminGetSession } from "medusa-react"
import React from "react"
import { Route, Routes } from "react-router-dom"
import SettingsCard from "../../components/atoms/settings-card"
import Spacer from "../../components/atoms/spacer"
import SettingContainer from "../../components/extensions/setting-container"
import SettingsPageErrorElement from "../../components/extensions/setting-container/setting-error-element"
import FeatureToggle from "../../components/fundamentals/feature-toggle"
import ArrowUTurnLeft from "../../components/fundamentals/icons/arrow-uturn-left"
import ChannelsIcon from "../../components/fundamentals/icons/channels-icon"
import CoinsIcon from "../../components/fundamentals/icons/coins-icon"
import CrosshairIcon from "../../components/fundamentals/icons/crosshair-icon"
import GearIcon from "../../components/fundamentals/icons/gear-icon"
import HappyIcon from "../../components/fundamentals/icons/happy-icon"
import KeyIcon from "../../components/fundamentals/icons/key-icon"
import MapPinIcon from "../../components/fundamentals/icons/map-pin-icon"
import TaxesIcon from "../../components/fundamentals/icons/taxes-icon"
import UsersIcon from "../../components/fundamentals/icons/users-icon"
import { useSettings } from "../../providers/setting-provider"
import CurrencySettings from "./currencies"
import Details from "./details"
import PersonalInformation from "./personal-information"
import Regions from "./regions"
import ReturnReasons from "./return-reasons"
import Taxes from "./taxes"
import Users from "./users"

enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
}

type SettingsCardType = {
  heading: string
  description: string
  icon?: React.ComponentType
  to: string
  feature_flag?: string
  permissions?: UserRoles[]
}

const settings: SettingsCardType[] = [
  {
    heading: "API Key Management",
    description: "Create and manage API keys",
    icon: KeyIcon,
    to: "/a/publishable-api-keys",
    feature_flag: "publishable_api_keys",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "Currencies",
    description: "Manage the currencies of your store",
    icon: CoinsIcon,
    to: "/a/settings/currencies",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "Personal Information",
    description: "Manage your profile",
    icon: HappyIcon,
    to: "/a/settings/personal-information",
    permissions: [UserRoles.MEMBER, UserRoles.ADMIN],
  },
  {
    heading: "Regions",
    description: "Manage shipping, payment, and fulfillment across regions",
    icon: MapPinIcon,
    to: "/a/settings/regions",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "Return Reasons",
    description: "Manage resons for returned items",
    icon: ArrowUTurnLeft,
    to: "/a/settings/return-reasons",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "Sales Channels",
    description: "Control which product are available in which channels",
    icon: ChannelsIcon,
    feature_flag: "sales_channels",
    to: "/a/sales-channels",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "Store Details",
    description: "Manage your business details",
    icon: CrosshairIcon,
    to: "/a/settings/details",
    permissions: [UserRoles.MEMBER, UserRoles.ADMIN],
  },
  {
    heading: "Taxes",
    description: "Manage taxes across regions and products",
    icon: TaxesIcon,
    to: "/a/settings/taxes",
    permissions: [UserRoles.ADMIN],
  },
  {
    heading: "The Team",
    description: "Manage members of your store",
    icon: UsersIcon,
    to: "/a/settings/team",
    permissions: [UserRoles.MEMBER, UserRoles.ADMIN],
  },
]

const renderCard = ({
  heading,
  description,
  icon,
  to,
  feature_flag,
}: SettingsCardType) => {
  const Icon = icon || GearIcon

  const card = (
    <SettingsCard
      heading={heading}
      description={description}
      icon={<Icon />}
      to={to}
    />
  )

  if (feature_flag) {
    return <FeatureToggle featureFlag={feature_flag}>{card}</FeatureToggle>
  }

  return card
}

const SettingsIndex = () => {
  const { getCards } = useSettings()
  const { user } = useAdminGetSession()

  console.log({ user })

  const extensionCards = getCards()

  return (
    <div className="gap-y-xlarge flex flex-col">
      <div className="gap-y-large flex flex-col">
        <div className="gap-y-2xsmall flex flex-col">
          <h2 className="inter-xlarge-semibold">General</h2>
          <p className="inter-base-regular text-grey-50">
            Manage the general settings for your store
          </p>
        </div>
        <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
          {settings
            .filter((s) => s.permissions?.includes(user.role))
            .map((s) => renderCard(s))}
        </div>
      </div>
      {extensionCards.length > 0 && (
        <div className="gap-y-large flex flex-col">
          <div className="gap-y-2xsmall flex flex-col">
            <h2 className="inter-xlarge-semibold">Extensions</h2>
            <p className="inter-base-regular text-grey-50">
              Manage the settings for your store&apos;s extensions
            </p>
          </div>
          <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
            {getCards().map((s) =>
              renderCard({
                heading: s.label,
                description: s.description,
                icon: s.icon,
                to: `/a/settings${s.path}`,
              })
            )}
          </div>
        </div>
      )}
      <Spacer />
    </div>
  )
}

const Settings = () => {
  const { getSettings } = useSettings()

  return (
    <Routes>
      <Route index element={<SettingsIndex />} />
      <Route path="/details" element={<Details />} />
      <Route path="/regions/*" element={<Regions />} />
      <Route path="/currencies" element={<CurrencySettings />} />
      <Route path="/return-reasons" element={<ReturnReasons />} />
      <Route path="/team" element={<Users />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/taxes/*" element={<Taxes />} />
      {getSettings().map((s) => (
        <Route
          key={s.path}
          path={s.path}
          element={<SettingContainer Page={s.Page} />}
          errorElement={<SettingsPageErrorElement origin={s.origin} />}
        />
      ))}
    </Routes>
  )
}

export default Settings
